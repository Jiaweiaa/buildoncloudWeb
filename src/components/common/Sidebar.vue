<template>
  <div class="sidebar">
    <i class="el-icon-arrow-right icon" v-show="listMenu.length > 0" @click="showMenu"></i>
    <!--
       菜单
   -->
    <transition enter-active-class="slideInLeft" leave-active-class="slideOutLeft" v-on:before-enter="beforeEnter">
      <div class="notifica animated" v-show="menuVisible" animate-delay="0s" animate-duration="0.5s">
        <div class="childMenu" style="float: left;font-size: 0rem">
          <div v-show="this.listMenu.length > 0" class="menuTitle">{{menuTitle}}</div>
          <el-button class="addProBtn" v-if="isProject == true" size="small" type="primary" @click="addEdit()">创建项目
          </el-button>
          <div v-if="isProject == false && systemMenu.length == 1" class="childItem"
               :class="{'activeClass':activeIndex == index}"
               v-for="(item,index) in listMenu"
               @click="clickThis(item, index)">
            <img v-if="isProject == false"
                 :src="nowIndex == index? '../../../static/img/'+item.name+'1.png' : '../../../static/img/'+item.name+'.png'"/>
            <div :class="nowIndex == index? 'activeClass' : ''" class="menuStyle" v-show="isProject == false">
              {{item.aliasName}}
            </div>
          </div>
          <div class="sysMenuBox" v-if="isProject == false && systemMenu.length > 1"
               :class="{'activeClass':activeIndex == index}"
               v-for="(item,index) in systemMenu"
               v-show="item.menu.length > 0">
            <div class="sysTitle">
              <img :src="'../../../static/img/'+item.name+'.png'"/>
              {{item.name}}
            </div>
            <div class="sysMenuChild" v-for="(childItem, iIndex) in item.menu"
                 @click="clickThis(childItem, iIndex, 'menuType' + index)">
              <div :class="nowIndex == iIndex && activeType == 'menuType' + index? 'activeClass' : ''" class="menuStyle"
                   v-show="isProject == false">
                {{childItem.aliasName}}
              </div>
            </div>
          </div>

          <div v-if="isProject == true">
            <div class="projectMenuType" v-show="this.buildingArr.length > 0">
              <p class="title"><img style="width: .22rem; top: .02rem;" src="../../../static/img/building.png"/>在建项目</p>
              <el-tooltip class="childPro" effect="light" :disabled="item.name.length < 10 ? true : false" :content="item.name" placement="top"  v-for="(item, index) in buildingArr">
                <p :class="activeIndex == index && activeType == 0 ? 'activeClass' : ''" @click="clickThis(item, index, 0)">
                  {{item.name}}
                </p>
              </el-tooltip>
            </div>
            <!--<div class="projectMenuType" v-show="this.waitBuildArr.length > 0">-->
            <!--<p class="title"><img src="../../../static/img/iswait.png"/>待开工项目</p>-->
            <!--<p :class="activeIndex == index && activeType == 1 ? 'activeClass' : ''" class="childPro"-->
            <!--v-for="(item, index) in waitBuildArr" @click="clickThis(item, index, 1)">-->
            <!--{{item.name}}-->
            <!--</p>-->
            <!--</div>-->
            <div class="projectMenuType" v-show="this.buildedArr.length > 0">
              <p class="title"><img src="../../../static/img/isbuilded.png"/>已交付项目</p>
              <el-tooltip effect="light" :disabled="item.name.length < 10 ? true : false" class="childPro" :content="item.name" placement="top"  v-for="(item, index) in buildedArr" >
                <p :class="activeIndex == index && activeType == 2 ? 'activeClass' : ''" @click="clickThis(item, index, 2)">
                  {{item.name}}
                </p>
              </el-tooltip>
            </div>
          </div>
        </div>
        <i class="el-icon-arrow-left icon" @click="closeMenu"></i>
      </div>
    </transition>

    <!--
      新建弹层
    -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="addtitle"
               :visible.sync="adddialogTableVisible" width="80%" :before-close="resetForm">
      <el-form :model="formAdd" :rules="rulesAdd" ref="formAdd" label-width="150px" class="demo-ruleForm"
               :inline="true" size="small">
        <div style="width: 100%;overflow: hidden">
          <div style="width: 50%;float: left;">
            <el-form-item label="项目名称" prop="name">
              <el-input size="small" placeholder="项目名称" :maxlength="100" style="width: 200px;"
                        v-model="formAdd.name"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectTypeId">
              <el-select size="small" v-model="formAdd.projectTypeId" placeholder="请选择" style="width: 200px;">
                <el-option
                  v-for="item in projectTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="width635" label="项目地址" prop="address">
              <el-input placeholder="详细地址" size="small" style="width: 200px;" :maxlength="50"
                        v-model="formAdd.address"></el-input>
            </el-form-item>
            <div class="amap-page-container">
              <el-amap-search-box class="search-box" :on-search-result="onSearchResult"></el-amap-search-box>
              <el-amap
                vid="amapDemo"
                :center="addCenter"
                :plugin="plugin"
                :zoom="addZoom"
                class="amap-demo addMap"
                :events="addEvents">
                <el-amap-marker v-for="(marker, index) in addMarkers" :position="marker.position"
                                :events="marker.events"></el-amap-marker>
              </el-amap>
            </div>
            <el-form-item label="开工日期" prop="startDate">
              <el-date-picker
                style="width: 200px;"
                v-model="formAdd.startDate"
                type="date"
                size="small"
                :picker-options="pickerOptions1"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="楼栋数" prop="buildNum">
              <el-input size="small" placeholder="楼栋数" :maxlength="20" style="width: 200px;"
                        v-model="formAdd.buildNum"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="area">
              <el-input size="small" placeholder="建筑面积" :maxlength="20" style="width: 200px;"
                        v-model="formAdd.area"></el-input>
            </el-form-item>
          </div>
          <div style="width: 50%;float: left;">
            <el-form-item label="所属公司" prop="unitId">
              <el-select size="small" style="width: 200px;" @change="unitChange" v-model="formAdd.unitId"
                         placeholder="请选择">
                <el-option
                  v-for="item in workerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开发商名称" prop="developerName">
              <el-input size="small" placeholder="开发商名称" :maxlength="20" style="width: 200px;"
                        v-model="formAdd.developerName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 50px;" label="竣工日期" prop="completionDate">
              <el-date-picker
                v-model="formAdd.completionDate"
                type="date"
                size="small"
                style="width: 200px;"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                format="yyyy 年 MM 月 dd 日">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="户数" prop="householdNum">
              <el-input size="small" placeholder="户数" :maxlength="20" style="width: 200px;"
                        v-model="formAdd.householdNum"></el-input>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-form-item label="项目描述">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="200"
              placeholder="最多填写200字"
              style="width: 600px;"
              class="textareaOverflow"
              :autosize="true"
              v-model="formAdd.projectDescribe">
            </el-input>
          </el-form-item>
        </div>
        <div style="width: 100%;overflow: hidden;">
          <div style="width: 50%;float: left;">
            <p style="border-bottom: 1px solid #ebeef5;width: 90%;margin-bottom: 10px;  margin-left: 8%;"> 项目经理信息</p>
            <el-form-item label="用户名" prop="projectManagerId">
              <el-select
                v-model="formAdd.projectManagerId"
                filterable
                remote
                clearable
                style="width: 200px;"
                size="small"
                resize="none"
                reserve-keyword
                @change="setname2"
                placeholder="请输入项目经理邮箱进行查询"
                loading-text="请输入最少5位"
                @focus="removeReadOnly($event)"
                :remote-method="remoteMethod2" :loading="projectManagerloading">
                <el-option
                  v-for="item in projectManagerOption"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                  <span style="float: left;margin-right: 10px;">{{ item.username }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.loginname}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目经理姓名">
              <el-input size="small" :disabled="true" style="width: 200px;" placeholder="项目经理姓名"
                        v-model="formAdd.projectManagerName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input size="small" :disabled="true" style="width: 200px;" placeholder="联系方式"
                        v-model="formAdd.projectManagerPhone"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('formAdd')">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('formAdd')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getMenu, getProjcetList,} from '../../api/api';
  import {
    createProject,
    allBranchList,
    validationProjectName,
    getProvince,
    getCity,
    getCounty,
    fuzzyQuery
  } from '../../api/projectapi';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      //校验开发商名称
      var validatedeveloperName = (rule, value, callback) => {
        if (value == '') {
          callback()
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,30}$/;
          if (!reg.test(value)) {
            callback(new Error('1-30个字符'));
          } else {
            callback()
          }
        }

      };
      //校验创建项目名称是否存在
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入项目名称'));
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5|-]{1,50}$/;
          if (!reg.test(value)) {
            callback(new Error('50位以内包含汉字、数字、字母、-'));
          } else {
            var parmas = {
              name: value
            }
            validationProjectName(parmas).then((res) => {
              if (res.data.code == 0) {
                callback();
              } else {
                callback(new Error(res.data.msg));
              }
            })
          }
        }
      };
      var checkunitId = (rule, value, callback) => {
        if (this.formAdd.unitId == '') {
          return callback(new Error('所属公司不能为空'));
        }
        callback();
      };
      var localL2 = (rule, value, callback) => {
        if (this.formAdd.unitId == '') {
          this.formAdd.projectCommissionerId = ''
          this.formAdd.projectCommissionerName = '';
          this.formAdd.projectCommissionerPhone = '';
          return callback(new Error('请先选择所属公司'));
        }
        if (this.formAdd.projectCommissionerId == '') {
          return callback(new Error('作业所负责人不能为空'));
        }
        callback();
      };
      var localL3 = (rule, value, callback) => {
        if (this.formAdd.unitId == '') {
          this.formAdd.projectManagerId = ''
          this.formAdd.projectManagerName = '';
          this.formAdd.projectManagerPhone = '';
          return callback(new Error('请先选择所属公司'));
        }
        if (this.formAdd.projectManagerId == '') {
          return callback(new Error('项目经理不能为空'));
        }
        callback();
      };
      var self = this;
      return {
        // 项目新增
        addZoom: 12,
        addCenter: [121.59996, 31.197646],
        addAddress: '',
        addMarkers: [{
          position: [0, 0],
          visible: true
        }],
        markPosition: [121, 31],
        addEvents: {
          click(e) {
            let {lng, lat} = e.lnglat;
            self.addLng = lng;
            self.addLat = lat;

            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });

            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.markPosition = [];
                  self.addMarkers = [];
                  self.markPosition.push(lng);
                  self.markPosition.push(lat);
                  let marker = {
                    position: self.markPosition,
                    visible: true
                  }
                  self.addMarkers.push(marker);
                  self.formAdd.address = result.regeocode.formattedAddress;
                }
              }
            });
          }
        },
        plugin: [{
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 100,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy:true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions:'all',
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log(result,status)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        }],
        addLng: '',
        addLat: '',
        lng: '',
        lat: '',
        searchOption: {},

        listData: [],
        listMenu: [],
        activeIndex: 0,
        activeType: '',
        nowIndex: 0,
        isProject: '',
        menuVisible: false,

        sameClickBok: '',
        menuTitle: '',

        // 在建
        buildingArr: [],
        // 已交付
        buildedArr: [],
        // 待开工
        waitBuildArr: [],
        showNext: true,
        // 系统管理列表
        systemMenu: [],
        projectTypeOption: [],

        //省市县options
        Province: [],
        City: [],
        Country: [],
        // 新增开关
        adddialogTableVisible: false,
        // 新增
        formAdd: {
          name: '',
          unitId: '',
          provinceId: '',
          cityId: '',
          countyId: '',
          address: '',
          developerName: '',
          projectTypeId: '',
          projectManagerId: '',
          projectManagerName: '',
          projectManagerPhone: '',
          projectCommissionerId: '',
          projectCommissionerName: '',
          projectCommissionerPhone: '',
          completionDate: '',
          startDate: '',
          buildNum: '',
          householdNum: '',
          area: '',
          projectDescribe: ''
        },
        projectManagerloading: false,
        rulesAdd: {
          name: [
            {required: true, validator: validateName, trigger: 'blur'}
          ],
          unitId: [
            {required: true, validator: checkunitId, trigger: 'change'}
          ],
          developerName: [
            {validator: validatedeveloperName, trigger: 'blur'}
          ],
          address: [
            {required: true, message: '项目所在地址不能为空', trigger: 'change'}
          ],
          projectTypeId: [
            {required: true, message: '项目类型不能为空', trigger: 'blur'}
          ],
          projectManagerId: [
            {required: true, validator: localL3, trigger: 'change'}
          ],
          projectCommissionerId: [
            {required: true, validator: localL2, trigger: 'change'}
          ],
          startDate: [
            {required: true, message: '开工日期不能为空', trigger: 'blur'}
          ],
          completionDate: [
            {required: true, message: '竣工日期不能为空', trigger: 'blur'}
          ],
          buildNum: [
            {required: true, message: '楼栋数不能为空', trigger: 'blur'}
          ],
          householdNum: [
            {message: '户数不能为空', trigger: 'blur'}
          ],
          area: [
            {required: true, message: '面积不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.getMenuList();
      // 获取所有项目类型
      this.getList();
      // 获取所有省
      this.getALlPro();
    },
    created() {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      };
      this.getCompany();
      this.$root.eventHub.$on('menuTitle', value => {
        this.menuTitle = value;
      });

      // 监听index变化
      this.$root.eventHub.$on('changeStatea', value => {
        this.activeIndex = value;
      });

      // 监听是否当前重复操作
      this.$root.eventHub.$on('sameClick', value => {
        this.sameClickBok = value;
        if (value) {
          if (this.listMenu.length > 0) {
            this.menuVisible = true;
          } else if (this.isProject) {
            this.menuVisible = true;
          } else {
            this.menuVisible = false;
          }
        }
      });

      // 监听是否是项目列表
      this.$root.eventHub.$on('isProjectList', value => {
        this.isProject = value;
        this.buildingArr = [];
        this.buildedArr = [];
        this.waitBuildArr = [];
        if (this.isProject == true) {
          this.activeIndex = 'null';
          this.menuVisible = true;
          for (var i = 0; i < this.listMenu.length; i++) {
            if (this.listMenu[i].states == 0) {
              if (this.listMenu[i].approvalstates !== 2) {
                this.waitBuildArr.push(this.listMenu[i]);
              }
            } else if (this.listMenu[i].states == 1) {
              this.buildingArr.push(this.listMenu[i]);
            } else {
              this.buildedArr.push(this.listMenu[i]);
            }
          }
        }
      });

      // 监听菜单变化
      this.$root.eventHub.$on('ChildMenu', value => {
        this.listMenu = value;
        this.systemMenu = [];
        if (!this.isProject) {
          // 日志
          let logs = {
            "name": "日志",
            "menu": []
          };
          // 基础数据
          let Basics = {
            "name": "基础数据",
            "menu": []
          };
          // 设备
          let equipments = {
            "name": "设备",
            "menu": []
          };
          // 用户
          let uers = {
            "name": "用户",
            "menu": []
          };
          // 企业
          let enterprises = {
            "name": "企业",
            "menu": []
          };
          // 信息
          let msgs = {
            "name": "信息",
            "menu": []
          };
          // 项目里的
          let others = {
            "name": "",
            "menu": []
          };

          let menuArr = [
            msgs, enterprises, uers, equipments, Basics, logs
          ];


          for (var i = 0; i < this.listMenu.length; i++) {
            if (this.listMenu[i].type == '日志') {
              logs.menu.push(this.listMenu[i])
            } else if (this.listMenu[i].type == '基础数据') {
              Basics.menu.push(this.listMenu[i])
            } else if (this.listMenu[i].type == '设备') {
              equipments.menu.push(this.listMenu[i])
            } else if (this.listMenu[i].type == '用户') {
              uers.menu.push(this.listMenu[i])
            } else if (this.listMenu[i].type == '企业') {
              enterprises.menu.push(this.listMenu[i])
            } else if (this.listMenu[i].type == '信息') {
              msgs.menu.push(this.listMenu[i])
            } else {
              others.menu.push(this.listMenu[i])
            }
          }

          if (others.menu.length) {
            this.systemMenu.push(others)
          } else {
            for (var i = 0; i < menuArr.length; i++) {
              this.systemMenu.push(menuArr[i]);
            }
          }
        }
        this.nowIndex = null;
        this.activeIndex = window.localStorage.getItem('activeIndexNow');
        if (this.listMenu.length > 0) {
          this.menuVisible = true;
        } else {
          this.menuVisible = false;
        }
      })


      if (window.localStorage.getItem('companyIdNow')) {
        this.project.projectId = window.localStorage.getItem('companyIdNow');
      }
      if (window.localStorage.getItem('isShowCompany') === '1') {
        this.comanyBok = true;
      } else if (window.localStorage.getItem('isShowCompany') === null) {
        this.comanyBok = true;
      } else {
        this.comanyBok = false;
      }
      if (window.localStorage.getItem('strArrAli')) {
        var arrAli = window.localStorage.getItem('strArrAli').split(',');
        var arrName = window.localStorage.getItem('strArrName').split(',');
        var arr = [];
        for (var i = 0; i < arrAli.length; i++) {
          var oJson = {};
          oJson.name = arrName[i];
          oJson.aliasName = arrAli[i];
          arr.push(oJson)
        }
        this.listMenu = arr;
        this.activeIndex = window.localStorage.getItem('activeIndexNow');
        if (this.activeIndex >= this.listMenu.length) {
          this.activeIndex = 0;
        }
      } else {
        this.getMenuList();
        this.activeIndex = 0;
      }

    },
    methods: {
      // 新增地图查询
      onSearchResult(posi) {
        if (posi.length > 0) {
          this.addCenter = [posi[0].lng, posi[0].lat];
          this.addZoom = 14;
        }
      },

      // 搜索
      //搜索项目管理员
      remoteMethod2(query) {
        this.projectManagerloading = true;
        if (this.formAdd.unitId == '') {
          this.$notify.error({
            title: '请先选择所属公司',
            message: '',
            offset: 100
          });
          return;
        }
        if (query.length < 5) {
          this.projectManagerOption = [];
          return;
        }
        if (query !== '') {
          var data = {
            key: query,
            unitId: this.formAdd.unitId,
            roleCode: 'PROJECT_ADMIN',
            pageNum: 1,
            pageSize: 10,
            simple: true
          }
          fuzzyQuery(data).then((res) => {
            if (res.data.code == 0) {
              this.projectManagerOption = res.data.data.list;
              this.projectManagerloading = false;
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        } else {
          this.projectManagerOption = [];
        }
      },
      //解决远程搜索IE兼容问题
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      // 获取所有省
      getALlPro() {
        getProvince().then((res) => {
          this.Province = res.data;
        })
      },
      // 根据id 获取相应下级的联动 省改变获取市
      editGetPro(id) {
        getCity(id).then((res) => {
          this.City = res.data;
        })
        if (id == 810000 || id == 820000 || id == 710000) {
          this.showNext = false;
        } else {
          this.showNext = true;
        }
      },

      proHasChanges() {
        this.formAdd.cityId = '';
        this.formAdd.countyId = '';
      },
      cityHasChanges() {
        this.formAdd.countyId = '';
      },

      editGetProCity(id) {
        getCounty(id).then((res) => {
          this.Country = res.data;
        })
      },
      //设置项目管理员信息
      setname2(val) {
        if (val == '') {
          this.formAdd.projectManagerName = '';
          this.formAdd.projectManagerPhone = '';
          return;
        }
        var arr = this.projectManagerOption;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == this.formAdd.projectManagerId) {
            this.formAdd.projectManagerName = arr[i].username;
            this.formAdd.projectManagerPhone = arr[i].phone;
          }
        }
      },
      //分公司更改
      unitChange() {
        this.formAdd.projectCommissionerId = '';
        this.formAdd.projectCommissionerName = '';
        this.formAdd.projectCommissionerPhone = '';
        this.formAdd.projectManagerId = '';
        this.formAdd.projectManagerName = '';
        this.formAdd.projectManagerPhone = '';
        var data = {
          key: '',
          unitId: this.formAdd.unitId,
          roleCode: 'PROJECT_ADMIN',
          pageNum: 1,
          pageSize: 10,
          simple: true
        }
        fuzzyQuery(data).then((res) => {
         if(res.data.data.list == '') {
          this.$notify.warning({
             title: '该公司没有项目经理,请先去创建项目经理！',
             offset: 100
           });
         }
        })
      },
      // 获取项目类型
      getList() {
        getProjcetList().then((res) => {
          if (res.data.code == 0) {
            this.projectTypeOption = res.data.data;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取项目类型失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      // 获取公司列表
      getCompany() {
        allBranchList().then((res) => {
          if (res.data.code == 0) {
            this.workerList = res.data.data;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取公司列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      // 创建项目
      addEdit() {
        this.menuVisible = true;
        this.projectCommissioner = [];
        this.projectManagerOption = [];
        this.adddialogTableVisible = true;
        this.addtitle = '创建项目';
        this.formAdd = {
          name: '',
          unitId: '',
          provinceId: '',
          cityId: '',
          countyId: '',
          address: '',
          developerName: '',
          projectTypeId: '',
          projectManagerId: '',
          projectManagerName: '',
          projectManagerPhone: '',
          projectCommissionerId: '',
          projectCommissionerName: '',
          projectCommissionerPhone: '',
          startDate: '',
          completionDate: '',
          buildNum: '',
          householdNum: '',
          area: '',
          projectDescribe: ''
        }
        if (this.workerList.length == 1) {
          this.formAdd.unitId = this.workerList[0].id
        }

      },

      // 确认提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = Object.assign({
              longitude: this.addLng,
              latitude: this.addLat
            }, this.formAdd);
            data.startDate = data.startDate.Format("yyyy-MM-dd");
            data.completionDate = data.completionDate.Format("yyyy-MM-dd");
            this.adddialogTableVisible = false;
            this.clearMapSearchInput();
            createProject(data).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '创建成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.$refs['formAdd'].resetFields();
                this.$root.eventHub.$emit('getMenuList', Math.random());
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '创建失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        })
      },

      // 取消提交
      resetForm() {
        this.$refs['formAdd'].resetFields();
        this.adddialogTableVisible = false;
        this.addLng = '';
        this.addLat = '';
        this.clearMapSearchInput();
      },
      // 清除地图上的搜索
      clearMapSearchInput() {
        let oMapSearchBox = document.querySelector('.search-box-wrapper input');
        oMapSearchBox.value = '';
      },

      // 展示列表
      showMenu() {
        this.menuVisible = true;
      },
      // 动画
      beforeEnter(el) {
        var delay = el.getAttribute('animate-delay'),
          duration = el.getAttribute('animate-duration');
        var cssObj = {
          "animation-delay": delay,
          "-webkit-animation-delay": delay,
          "animation-duration": duration,
          "-webkit-animation-duration": duration,
          "visibility": "visible"
        }
        var getCssText = function (obj) {
          var text = [];
          for (var o in obj) {
            text.push(o + ":" + obj[o])
          }
          return text.join(';')
        }
        el.style.cssText = getCssText(cssObj);
      },
      // 获取目录
      getMenuList() {
        getMenu().then((res) => {
          if (res.data.code == 0) {
            this.listData = res.data.data;
            this.listMenu = this.listData[0].buttons;
            return;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取权限列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      getRouter() {
        if (this.$route.path == '/equipment-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/manufacturer-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/branch-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/project-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/worker-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else {
          this.comanyBok = true;
          window.localStorage.setItem('isShowCompany', '1');
        }
      },

      // 导航栏跳转
      clickThis(item, index, type) {
        if (window.localStorage.getItem('linshiIndex')) {
          window.localStorage.setItem('activeIndex', window.localStorage.getItem('linshiIndex'));
        }
        if (this.isProject) {
          this.activeIndex = index;
          this.activeType = type;
          this.menuVisible = false;
          window.localStorage.setItem('activeIndexNow', this.activeIndex + '');
          this.$root.eventHub.$emit('idChange', item.id);
          this.$router.push({
            path: '/projectmanagerxq', query: {
              id: item.id
            }
          })
        } else if (this.systemMenu.length > 1) {
          this.nowIndex = index;
          this.activeType = type;
          this.activeIndex = index;
          this.menuVisible = false;
          window.localStorage.setItem('activeIndexNow', index + '');
          this.$router.push('/' + item.name);
        } else {
          this.nowIndex = index;
          this.activeIndex = index;
          this.menuVisible = false;
          window.localStorage.setItem('activeIndexNow', index + '');
          this.$router.push('/' + item.name);
        }
      },

      // 关闭菜单
      closeMenu() {
        this.menuVisible = false;
        var str = localStorage.getItem("activeIndexNow");
        if (str==="") {
          this.$emit("sidebarIndex")
        }
      }
    },
    watch: {
      $route() {
        this.getRouter();
      }
    }
  }
</script>

<style scoped>
  .notifica {
    width: 17%;
    position: fixed;
    left: 0;
    height: calc(100% - .45rem);
    background: rgb(44, 50, 68);
    z-index: 999;
    top: .45rem;
  }

  .sidebar {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
  }

  .sidebar .icon {
    display: block;
    width: 25px;
    height: 25px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    font-size: 18px;
    z-index: 1;
    cursor: pointer;
  }

  .sidebar .el-icon-arrow-right {
    left: 10px;
  }

  .sidebar .el-icon-arrow-left {
    right: 10px;
  }

  .sidebar .sysMenuBox .sysTitle {
    color: #fff;
    font-size: .15rem;
    height: .24rem;
    line-height: .24rem;
    position: relative;
    padding-left: .25rem;
  }

  .sidebar .sysMenuBox .sysTitle img {
    width: .17rem;
    position: absolute;
    top: .03rem;
    left: 0;
  }

  .sidebar .sysMenuBox .sysMenuChild {
    font-size: .14rem;
    color: rgb(150, 157, 176);
    height: .25rem;
    line-height: .25rem;
    cursor: pointer;
    padding-left: .25rem;
    position: relative;
  }

  .sidebar .sysMenuBox:nth-child(3) .sysTitle img {
    width: .23rem;
    left: -.03rem;
    top: .01rem;
  }

  .sidebar .sysMenuBox .sysMenuChild img {
    width: 15px;
    position: absolute;
    top: 4px;
    left: 5px;
  }

  .sidebar .sysMenuBox .sysMenuChild .activeClass {
    color: #fff;
  }

  .sidebar > ul {
    height: 100%;
  }

  .menuText {
    display: block;
    position: relative;
    top: -9px;
    text-align: center;
    width: 100%;
    font-size: 12px;
  }

  .logo {
    width: 90%;
    height: 70px;
    position: relative;
    padding-top: 20px;
    border-bottom: 1px solid #222839;
    margin: 0 auto;
  }

  .logo img {
    display: block;
    margin: 0 auto;

  }

  .el-menu-vertical-demo {
    width: 80px;
  }

  .menuTitle {
    width: 100%;
    height: 30px;
    color: #fff;
    font-size: .16rem;
  }

  .childMenu {
    margin-top: 10px;
    width: calc(100% - 20px);
    padding-left: 20px;
  }

  .childItem {
    color: rgb(150, 157, 176);
    font-size: .13rem;
    cursor: pointer;
    width: 100%;
    height: .4rem;
    line-height: .4rem;
    position: relative;
  }

  .childItem img {
    width: .2rem;
    position: absolute;
    top: .07rem;
    left: 0;
  }

  .childItem .menuStyle {
    position: absolute;
    left: 30px;
  }

  .sidebar .projectMenuType .title {
    color: #fff;
    font-size: .14rem;
    height: .3rem;
    line-height: .3rem;
    padding-left: .25rem;
    position: relative;
  }

  .sidebar .projectMenuType .title img {
    position: absolute;
    left: 0;
    top: .05rem;
    width: .18rem;
  }

  .sidebar .projectMenuType .childPro {
    font-size: .13rem;
    height: .3rem;
    line-height: .3rem;
    margin-left: .25rem;
    color: rgb(150, 157, 176);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar .projectMenuType .activeClass {
    color: #fff;
  }

  .sidebar .childItem .activeClass {
    color: #fff;
  }

  .sidebar .addProBtn {
    margin: 10px 0;
    background: rgb(44, 50, 20);
  }

  .width635 {
    width: 730px;
  }
</style>
<style>
  .el-input-number .el-input__inner {
    height: 40px !important;
  }
</style>
