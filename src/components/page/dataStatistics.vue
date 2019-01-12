<template>
  <div>
    <div class="dataStatistics" v-if="this.dataTypeOfPage == 0">
      <!--
         总数统计数据模块
      -->
      <div class="headSummary">
        <div class="childHeadSummary" v-for="item in summaryData">
          <div class="childHeadTitle">{{item.name ? item.name : ''}}</div>
          <div class="childHeadNum">{{item.value}}</div>
          <el-popover
            placement="top"
            width="100"
            class="childheadNumyoun"
            trigger="hover">
            <div class="childheadNumyoun">
              {{item.describe}}
            </div>
            <img slot="reference" class="childHeadIcon" src="../../../static/img/i.png"/>
          </el-popover>
        </div>
      </div>

      <!--
          名片
      -->
      <div class="businessCard">
        <div class="topBox">
          <p style="width: 100%; height: 100%">
            <span id="pick-avatar" class="headBox">
              <span class="maskStr">更换头像</span>
              <img class="headPhoto"
                   :src="this.photoId ? '/workerman/fileupload/pageShowFile?fid=' + this.photoId :  '../../../static/img/headPhoto.png'"/>
            </span>
            <span class="headBoxYoung"
              style="position: absolute; left: 1.7rem; margin-left: -.3rem;width: 1.7rem;  top: .2rem; height: .3rem;text-align: left; overflow: hidden; line-height: .3rem;">{{adminData.username}}</span>
            <span class="headBoxYoungOne"
              style="position: absolute; left: 1.4rem; overflow:hidden; top: .6rem; height: .4rem; line-height: .2rem;">{{adminData.Rolenames}}</span>
          </p>
        </div>
        <div class="bottomBox">
          <img class="cardIcon" src="../../../static/img/company.png"/>
          <p style="height: .2rem; top: .41rem; font-size: .14rem; line-height: .2rem;">
            {{adminData.unit ? adminData.unit.name : '' }}</p>
        </div>
        <div class="bottomBox">
          <i class="el-icon-message"></i>
          <p>{{adminData.loginname}}</p>
        </div>
        <div class="bottomBox">
          <i class="el-icon-mobile-phone"></i>
          <p>{{adminData.phone}}</p>
        </div>
      </div>

      <!--
        更换头像
      -->
      <avatarCropper
        @uploaded="handleUploaded"
        trigger="#pick-avatar"
        :upload-url='"/workerman/authority/uploadImages?tokenId="+tokenId+"&tokenStr="+tokenStr' />

      <!--
        线形图
      -->
      <div style="position: relative; overflow: hidden;">
        <div class="dataDateChange">
          <p :class="{activeDateClass : activeDateChange == 'hours'}" @click="dataDateChange('hours')">小时</p>
          <p :class="{activeDateClass : activeDateChange == 'week'}" @click="dataDateChange('week')">周</p>
        </div>
        <div id="myChartEntrance" :style="{width: '9.3rem', height: '4rem', float:'left',fontSize:'.16rem'}"></div>
      </div>

      <!--
        编辑 重新提交
      -->
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="addtitle"
                 :visible.sync="adddialogTableVisible" width="80%" :before-close="resetForm">
        <el-form :model="formAdd" :rules="rulesAdd" ref="formAdd" label-width="1.5rem" class="demo-ruleForm"
                 :inline="true" size="small">
          <div style="width: 100%;overflow: hidden">
            <div style="width: 50%;float: left;">
              <el-form-item label="项目名称" prop="name">
                <el-input size="small" placeholder="项目名称" :maxlength="100" style="width: 2rem;"
                          v-model="formAdd.name"></el-input>
              </el-form-item>
              <el-form-item label="项目类型" prop="projectTypeId">
                <el-select size="small" v-model="formAdd.projectTypeId" placeholder="请选择" style="width: 2rem;">
                  <el-option
                    v-for="item in projectTypeOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width635" label="项目地址" prop="address">
                <el-input placeholder="详细地址" size="small" style="width: 2rem;" :maxlength="50"
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
                  style="width: 2rem;"
                  v-model="formAdd.startDate"
                  type="date"
                  size="small"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="楼栋数" prop="buildNum">
                <el-input size="small" placeholder="楼栋数" :maxlength="20" style="width: 2rem;"
                          v-model="formAdd.buildNum"></el-input>
              </el-form-item>
              <el-form-item label="建筑面积" prop="area">
                <el-input size="small" placeholder="建筑面积" :maxlength="20" style="width: 2rem;"
                          v-model="formAdd.area"></el-input>
              </el-form-item>
            </div>
            <div style="width: 50%;float: left;">
              <el-form-item label="所属公司" prop="unitId">
                <el-select size="small" style="width: 2rem;" @change="unitChange" v-model="formAdd.unitId"
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
                <el-input size="small" placeholder="开发商名称" :maxlength="20" style="width: 2rem;"
                          v-model="formAdd.developerName"></el-input>
              </el-form-item>
              <el-form-item style="margin-top: .5rem;" label="竣工日期" prop="completionDate">
                <el-date-picker
                  v-model="formAdd.completionDate"
                  type="date"
                  size="small"
                  style="width: 2rem;"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  format="yyyy 年 MM 月 dd 日">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="户数" prop="householdNum">
                <el-input size="small" placeholder="户数" :maxlength="20" style="width: 2rem;"
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
                style="width: 6rem;"
                class="textareaOverflow"
                :autosize="true"
                v-model="formAdd.projectDescribe">
              </el-input>
            </el-form-item>
          </div>
          <div style="width: 100%;overflow: hidden;">
            <div style="width: 50%;float: left;">
              <p style="border-bottom: 1px solid #ebeef5;width: 90%;margin-bottom: .1rem;  margin-left: 8%;"> 项目经理信息</p>
              <el-form-item label="用户名" prop="projectManagerId">
                <el-select
                  v-model="formAdd.projectManagerId"
                  filterable
                  remote
                  clearable
                  style="width: 2rem;"
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
                    <span style="float: left;margin-right: .1rem;">{{ item.username }}</span>
                    <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.loginname}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理姓名">
                <el-input size="small" :disabled="true" style="width: 2rem;" placeholder="项目经理姓名"
                          v-model="formAdd.projectManagerName"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input size="small" :disabled="true" style="width: 2rem;" placeholder="联系方式"
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
      <div class="projectList">
        <div style="height: .5rem"
             v-if="contains(roles,'HEAD_OFFICE_ADMIN') || contains(roles,'BRANCH_ADMIN') || contains(roles,'PROJECT_ADMIN') || contains(roles,'PROJECT_COMMISSIONER')">
          <el-button size="small" type="primary"
                     style="position: relative;top: -.6rem;"
                     @click="addEdit(1,null)">创建新项目</el-button>
        </div>

        <!--查询-->
        <div class="query">
          <ul class="term">
            <li class="term_item">
              <div class="demo-input-suffix">项目名称：<el-input
                placeholder="项目名称"
                style="width: 2rem;"
                :maxlength="100"
                size="small"
                v-model="queryFrom.projectName">
              </el-input>
              </div>
            </li>
            <li class="term_item">
              <div class="demo-input-suffix">
                项目经理:
                <el-select
                  v-model="queryFrom.projectManagerId"
                  filterable
                  remote
                  clearable
                  style="width: 2rem;"
                  size="small"
                  reserve-keyword
                  placeholder="请输入项目经理邮箱进行查询"
                  @focus="removeReadOnly($event)"
                  :remote-method="remoteMethod3"
                  :loading="projectCommissionerloading"
                  loading-text="请输入最少5位">
                  <el-option
                    v-for="item in projectCommissioner2"
                    :key="item.id"
                    :label="item.loginname"
                    :value="item.id">
                    <span style="float: left">{{ item.loginname }}</span>
                    <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.username }}</span>
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="term_item">
              <div class="demo-input-suffix">
                项目状态：
                <el-select
                  style="width: 2rem;"
                  size="small"
                  v-model="queryFrom.states"
                  filterable
                  placeholder="请选择">
                  <el-option
                    v-for="item in statesOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <ul class="time">
            <li class="time_item">
              <div class="demo-input-suffix">
                开工日期：
                <el-date-picker
                  style="width: 2.5rem;"
                  size="small"
                  v-model="beginDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </li>
            <li class="time_item">
              <div class="demo-input-suffix">
                竣工日期：
                <el-date-picker
                  style="width: 2.5rem;"
                  size="small"
                  v-model="finishDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </div>
            </li>

          </ul>
          <el-button style="position: absolute;right: .1rem;bottom: .1rem;" size="small" type="primary"
                     icon="el-icon-search" @click="projectList">搜索
          </el-button>
          <el-button size="small" style="position: absolute;right: 1.1rem;bottom: .1rem;" @click="reset"
                     icon="el-icon-refresh">重置
          </el-button>
        </div>
        <!--列表-->
        <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
                  :data="tableData"
                  border
                  style="font-size:.12rem"
        >
          <el-table-column
            label="项目名称" align="center" :show-overflow-tooltip="true" min-width="15%">
            <template scope="scope">
              <p>{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="项目类型" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <p>{{ scope.row.projecttypename}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="所属公司" align="center" :show-overflow-tooltip="true" min-width="10%">
            <template scope="scope">
              <p>{{ scope.row.sunitname }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="项目经理" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <p>{{ scope.row.projectmanagername}}</p>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--label="所在城市" align="center" :show-overflow-tooltip="true" min-width="12%">-->
            <!--<template scope="scope">-->
              <!--<p>{{ scope.row.provinceName }}&nbsp;-&nbsp;{{ scope.row.cityname }}</p>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            label="开工日期" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <p>{{ scope.row.startdate }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="竣工日期" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <p>{{ scope.row.completiondate }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="审批状态" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <el-popover v-if="scope.row.approvalstates.number==2" trigger="hover" placement="top">
                <p>拒绝原因：{{ scope.row.approvalnote}}</p>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.approvalstates.name }}
                </div>
              </el-popover>
              <p v-else="scope.row.approvalstates.number==2">{{scope.row.approvalstates.name }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="项目状态" align="center" :show-overflow-tooltip="true" min-width="8%">
            <template scope="scope">
              <p>{{ scope.row.states}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" min-width="15%">
            <template scope="scope">
              <div v-if="scope.row.approvalstates.number!==1">
                <el-button v-if="scope.row.approvalstates.number!==2"
                           size="small"
                           type="text"
                           @click="addEdit(2,scope.row.id)">编辑
                </el-button>
                <el-button v-else="scope.row.approvalstates.number!==2"
                           size="small"
                           type="text"
                           @click="addEdit(2,scope.row.id)">重新提交
                </el-button>
                <el-button v-if="!scope.row.state" size="small" type="text" style="color: red;"
                           @click="handleDelete(scope.row.id)">删除
                </el-button>
              </div>
              <div v-if="scope.row.approvalstates.number==1">
                <el-button v-if="!scope.row.state"
                           size="small"
                           type="text"
                           @click="changecontentState(scope.row.id)">项目操作
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float: right;margin-top: .1rem;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
        <div v-show="downloadShow" class="nodeDownload animated" animate-delay="0s" animate-duration="0.5s">
          <p class="titleChrome">为了更好的用户体验我们推荐使用chrome浏览器来打开页面</p>
          <!--<el-button type="text" icon="el-icon-download" class="downloadfile" @click="downloadFileBrowser">下载</el-button>-->
          <span class="downloadfile" icon="el-icon-download" @click="downloadFileBrowser">下载</span>
          <span @click="downloadShow=false"
                style="float: right;display: inline-block;height: 100%;line-height: .4rem;width: .4rem;text-align: center;color: #fff;cursor: pointer;font-size: .14rem">X</span>
        </div>
      </transition>
    </div>
    <router-view v-else></router-view>
  </div>
</template>
<script>
  import {getAdmin, getStatistical, getLineChart, getUserCompany, getProjcetList, topBranchList} from '../../api/api'
  import {
    getProvince,
    getCity,
    getCounty,
    fuzzyQuery,
    createProject,
    projectList,
    getProjectById,
    updateProject,
    delProject,
    allBranchList,
    validationProjectName,
    eidtValidationProjectName
  } from '../../api/projectapi'

  import Project from './project.vue'
  import avatarCropper from "vue-avatar-cropper"
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      //项目id
      project: {
        type: Object
      }
    },
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
            if (this.clickType == 1) {
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
            } else {
              var parmas = {
                name: value,
                id: this.projectManagerOptionId
              }
              eidtValidationProjectName(parmas).then((res) => {
                if (res.data.code == 0) {
                  callback();
                } else {
                  callback(new Error(res.data.msg));
                }
              })
            }
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
        if (this.formAdd.unitId == []) {
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
          this.formAdd.projectManagerId = '';
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
        tokenId: '',
        tokenStr: '',

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
          timeout: 30000,          //超过10秒后停止定位，默认：无穷大
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

        downloadShow: false,
        // 人员信息
        adminData: [],

        // 折线图数据类更改
        activeDateChange: 'week',
        // 路由显示页
        dataTypeOfPage: 0,

        // 顶部总数统计数据
        summaryData: [],

        //线型图数据
        xAxisData: [],
        useData: [],
        passData: [],

        // 头像id
        photoId: '',

        pickerOptions1: {
          disabledDate: (time) => {
            if (this.formAdd.completionDate) {
              return time.getTime() > this.formAdd.completionDate.getTime();
            }
          }
        },
        pickerOptions: {
          disabledDate: (time) => {
            if (this.formAdd.startDate) {
              return time.getTime() < new Date(this.formAdd.startDate).getTime();
            }

          }
        },

        //项目详情
        formProject: {},
        //项目名称
        projectName: '',

        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,
        //查询form
        queryFrom: {
          pageNo: 1,
          pageSize: 10,
          projectName: '',
          projectManagerId: '',
          projectUnitId: '',
          beginStartDate: '',
          beginEndDate: '',
          finishStartDate: '',
          finishEndDate: '',
          states: ''
        },
        //项目管理员 loding
        projectManagerloading: false,
        //项目管理员option
        projectManagerOption: [],
        //作业所负责人  loding
        projectCommissionerloading: false,
        //作业所负责人option
        projectCommissioner: [],
        projectCommissioner2: [],
        //项目状态option
        statesOption: [
          {
            id: '',
            name: '全部'
          },
          {
            id: 0,
            name: '待开工'
          }, {
            id: 1,
            name: '在建'
          },
          {
            id: 2,
            name: '已交付'
          }
        ],
        // 开工日期
        beginDate: [],
        //竣工日期
        finishDate: [],
        //列表
        loading: false,
        tableData: [],

        formLabelWidth: '120px',

        clickType: 0,
        //编辑项目id
        projectManagerOptionId: '',

        //添加弹层
        adddialogTableVisible: false,
        addtitle: '创建新项目',
        //添加form
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
        },

        //省市县options
        Province: [],
        City: [],
        Country: [],

        showNext: true,
        //公司类别option
        workerList: [],
        //项目类型option
        projectTypeOption: [],
        //记录 作业所负责人 项目管理员
        jiluForm: {
          unitId: '',
          projectCommissioner: {},

          projectManager: {}
        },
        roles: [],
        isone: false,
        // 第一次登陆系统
        oneLogin: false
      }
    },
    mounted() {
      if (window.localStorage.getItem('dataTypeOfPage')) {
        this.dataTypeOfPage = window.localStorage.getItem('dataTypeOfPage');
      }
      this.$root.eventHub.$on('changeState', value => {
        this.dataTypeOfPage = value;
        // 拿线形图数据
        this.getLineChartData();
      });

      // 拿顶部统计数据
      this.getStatisticalFun();
      // 拿名片信息
      this.getAdminData();
      // 拿线形图数据
      this.getLineChartData();

      // 获取所有省
      this.getALlPro();
      // 获取公司列表
      this.getCompany();
      // 获取项目类型
      this.getList();
      this.browser();
      //获取项目列表
      this.$nextTick(() => {
        this.projectList();
      })

    },
    components: {
      Project,
      avatarCropper
    },
    created() {
      this.tokenId = window.sessionStorage.getItem('tokenId');
      this.tokenStr = window.sessionStorage.getItem('tokenStr');
      // 监听是否创建新项目了
      this.$root.eventHub.$on('getMenuList', value => {
        this.projectList();
      });
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

      handleUploaded(res) {
        if (res.code == 0) {
          this.photoId = res.data;
          this.$notify.success({
            title: res.msg,
            offset: 100
          });

        } else {
          this.$notify.error({
            title: res.msg,
            offset: 100
          });
        }
      },

      // 获取名片信息
      getAdminData() {
        getAdmin().then((res) => {
          if (res.data.code == 0) {
            this.adminData = res.data.data;
            this.photoId = this.adminData.imagesId;
            var names = '';
            for (var i = 0; i < this.adminData.roles.length; i++) {
              names += this.adminData.roles[i].name + ',';
              this.adminData.Rolenames = names.substr(0, names.length - 1);
            }

            res.data.data.roles.forEach((item) => {
              if(item.code ==="HEAD_OFFICE_ADMIN") {
                window.sessionStorage.setItem('isTopAdmin', true);
              }else {
                window.sessionStorage.setItem('isTopAdmin', false);
              }
            })

            var arr = res.data.data.roles;
            var arr2 = []
            for (var i = 0; i < arr.length; i++) {
              arr2.push(arr[i].code)
            }
            this.roles = arr2;
          } else if (res.data.code === 99){
            this.$router.replace('/');
            myCallback.call(this,res)
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取项目类型失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 获取统计数据
      getStatisticalFun() {
        getStatistical().then((res) => {
          // 顶部数据
          this.summaryData = res.data.data.topData;
        })
      },
      // 去分布页
      goDistribution() {
        this.dataTypeOfPage = 1;
        this.$router.push('/data-distribution');
      },

      // 折线图数据类型更改
      dataDateChange(type) {
        this.activeDateChange = type;
        this.getLineChartData();
      },
      // 清除数据
      dataDateClear() {
        this.xAxisData = [];
        this.useData = [];
        this.passData = [];
      },

      // 拿线行图数据
      getLineChartData() {
        var parmas = {
          'type': this.activeDateChange
        }
        this.dataDateClear();
        getLineChart(parmas).then((res) => {
          let data = res.data.data;
          for (var i = 0; i < data.length; i++) {
            this.xAxisData.push(data[i].time);
            this.useData.push(data[i].totalCount);
            this.passData.push(data[i].passCount)
          }
          // 线形图
          this.drawLineEntrance();
        })
      },

      // 线形图
      drawLineEntrance() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChartEntrance'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '门禁使用状态图',
            // textStyle:{
            //   fontSize:'30',
            //   color:'#000'
            // }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['使用次数', '通过次数']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            },
            // textStyle: {
            //   fontSize: 30 // 让字体变大
            // }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData,
            // textStyle: {
            //   fontSize: 30 // 让字体变大
            // }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              // textStyle: {
              //   fontSize: 30 // 让字体变大
              // }
            },
          },
          series: [
            {
              name: '使用次数',
              type: 'line',
              data: this.useData,
            },
            {
              name: '通过次数',
              type: 'line',
              data: this.passData,
            }
          ]
        });
      },
      // 地图
      myChartMap() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChartMap'));
        // 绘制图表
        myChart.setOption({
          title: {
            textStyle:{
              fontSize:30,
              color:'#000'
            },
            text: '全国项目分布图(在建中)',
            subtext: '数据支持来自善兔科技',
          },
          visualMap: {
            min: 1,
            max: 30,
            text: ['High', 'Low'],
            left: 'right',
            realtime: false,
            inRange: {
              color: ['lightskyblue', 'SlateBlue', 'blue']
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} 个项目',
          },
          series: [
            {
              type: 'map',
              mapType: 'china', // 自定义扩展图表类型
              itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
              },
              roam: true,
              data: this.mapData
            }
          ]
        });
      },

      //判断数组中是否有某一项
      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },
      //解决远程搜索IE兼容问题
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      //所属分公司改变时
      unitChange() {
        if (this.clickType == 1) {
          this.formAdd.projectCommissionerId = '';
          this.formAdd.projectCommissionerName = '';
          this.formAdd.projectCommissionerPhone = '';
          this.formAdd.projectManagerId = '';
          this.formAdd.projectManagerName = '';
          this.formAdd.projectManagerPhone = '';
        }
        if (this.clickType == 2) {
          if (this.formAdd.unitId == this.jiluForm.unitId) {
            this.projectCommissioner = [];
            this.projectCommissioner.push(this.jiluForm.projectCommissioner);
            this.projectManagerOption = [];
            this.projectManagerOption.push(this.jiluForm.projectManager)

            this.formAdd.projectCommissionerId = this.jiluForm.projectCommissioner.id;
            this.formAdd.projectCommissionerName = this.jiluForm.projectCommissioner.username;
            this.formAdd.projectCommissionerPhone = this.jiluForm.projectCommissioner.phone;
            this.formAdd.projectManagerId = this.jiluForm.projectManager.id;
            this.formAdd.projectManagerName = this.jiluForm.projectManager.username;
            this.formAdd.projectManagerPhone = this.jiluForm.projectManager.phone;
          } else {
            this.formAdd.projectCommissionerId = '';
            this.formAdd.projectCommissionerName = '';
            this.formAdd.projectCommissionerPhone = '';
            this.formAdd.projectManagerId = '';
            this.formAdd.projectManagerName = '';
            this.formAdd.projectManagerPhone = '';
          }
        }
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
      //进入项目操作
      changecontentState(id) {
        this.dataTypeOfPage = 1;
        // 进入项目操作时候, 让菜单到项目管理
        this.$root.eventHub.$emit('isProjectDoit', Math.random());
        this.$router.push({
          path: '/projectmanagerxq', query: {
            id: id
          }
        })
      },
      //重置
      reset() {
        this.queryFrom = {
          pageNo: this.pageNo,
          pageSize: this.pagesize,
          projectName: '',
          projectManagerId: '',
          projectUnitId: '',
          beginStartDate: '',
          beginEndDate: '',
          finishStartDate: '',
          finishEndDate: '',
          states: ''
        }
        this.beginDate = [];
        this.finishDate = [];
      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.pagesize = val;
        this.projectList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.pageNo = val;
        this.projectList();
      },
      //获取项目列表
      projectList() {
        var self = this;
        self.tableData = [];
        this.loading = true;
        this.queryFrom.projectUnitId = this.project.projectId;
        this.queryFrom.pageSize = this.pagesize;
        this.queryFrom.pageNo = this.pageNo;
        if (this.beginDate != null) {
          this.queryFrom.beginStartDate = this.beginDate[0];
          this.queryFrom.beginEndDate = this.beginDate[1];
        } else {
          this.queryFrom.beginStartDate = '';
          this.queryFrom.beginEndDate = '';
        }
        if (this.finishDate != null) {
          this.queryFrom.finishStartDate = this.finishDate[0];
          this.queryFrom.finishEndDate = this.finishDate[1];
        } else {
          this.queryFrom.finishStartDate = '';
          this.queryFrom.finishEndDate = '';
        }
        projectList(this.queryFrom).then((res) => {
          if (res.data.code == 0) {
            self.total = res.data.data.totalCount;
            var arr = res.data.data.list;
            for (var i = 0; i < arr.length; i++) {
              var approvalStates = {};
              if (arr[i].approvalstates == 0) {
                approvalStates = {
                  number: 0,
                  name: '待审核'
                }
              }
              if (arr[i].approvalstates == 1) {
                approvalStates = {
                  number: 1,
                  name: '审核通过'
                }
              }
              if (arr[i].approvalstates == 2) {
                approvalStates = {
                  number: 2,
                  name: '审核拒绝'
                }
              }
              if (arr[i].states == 0) {
                arr[i].states = '待开工'
              }
              if (arr[i].states == 1) {
                arr[i].states = '在建'
              }
              if (arr[i].states == 2) {
                arr[i].states = '已交付'
              }
              var json = {
                id: arr[i].id,
                name: arr[i].name,
                projecttypename: arr[i].projecttypename,
                provinceName: arr[i].provincename,
                cityname: arr[i].cityname,
                projectmanagername: arr[i].projectmanagername,
                sunitname: arr[i].sunitname,
                startdate: arr[i].startdate,
                completiondate: arr[i].completiondate,
                approvalstates: approvalStates,
                approvalnote: arr[i].approvalnote,
                states: arr[i].states
              }

              self.tableData.push(json);

            }
            self.loading = false;
          } else {
            self.loading = false;
            myCallback.call(self,res)
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //设置作业所负责人姓名
      setname(val) {
        if (this.formAdd.unitId == '') {
          return;
        }
        if (val == '') {
          this.formAdd.projectCommissionerName = '';
          this.formAdd.projectCommissionerPhone = '';
          return;
        }
        var arr = this.projectCommissioner;

        var bOk = true;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == this.formAdd.projectCommissionerId) {
            this.formAdd.projectCommissionerName = arr[i].username;
            this.formAdd.projectCommissionerPhone = arr[i].phone;
            bOk = false;
          }
        }
        if (bOk) {
          return;
        }
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
      // 获取项目类型
      getList() {
        getProjcetList().then((res) => {
          if (res.data.code == 0) {
            this.projectTypeOption = res.data.data;
          } else if(res.data.code === 99) {
            this.$router.replace('/');
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取项目类型失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      //添加项目  编辑
      addEdit(type, id) {
        var self = this;
        this.clickType = type;
        if (type == 1) {
          self.projectCommissioner = [];
          self.projectManagerOption = [];
          this.adddialogTableVisible = true;
          this.addtitle = '创建新项目';
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
        }
        if (type == 2) {
          this.projectManagerOptionId = id;
          this.addtitle = '编辑项目';
          var data = {
            projectId: id
          }
          getProjectById(data).then((res) => {
            if (res.data.code == 0) {
              var json = res.data.data;
              self.editGetPro(json.province.id);
              self.editGetProCity(json.city.id)
              self.projectCommissioner = [];
              self.projectCommissioner.push(json.projectCommissioner);
              self.projectManagerOption = [];
              self.projectManagerOption.push(json.projectManager)
              self.formAdd = {
                name: json.name,
                unitId: json.unitId,
                provinceId: json.province.id,
                cityId: json.city.id,
                countyId: json.county.id,
                address: json.address,
                developerName: json.developerName,
                projectTypeId: json.projectTypeId,
                projectManagerId: json.projectManagerId,
                projectManagerName: json.projectManager.username,
                projectManagerPhone: json.projectManager.phone,
                projectCommissionerId: json.projectCommissionerId,

                startDate: new Date(json.startDate),
                completionDate: new Date(json.completionDate),
                buildNum: json.buildNum,
                householdNum: json.householdNum,
                area: json.area,
                projectDescribe: json.projectDescribe
              }
              this.jiluForm.projectCommissioner = json.projectCommissioner;
              this.jiluForm.projectManager = json.projectManager;
              this.jiluForm.unitId = json.unitId;

              self.adddialogTableVisible = true;

            } else {
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: '获取项目信息失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }
      },
      //删除项目
      handleDelete(id) {
        var self = this;
        this.$confirm('确定删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {projectId: id}
          delProject(data).then((res) => {
            if (res.data.code == 0) {
              myCallback.call(self,res)
              // self.$notify.success({
              //   title: '删除',
              //   // message: '删除成功!',
              //   // offset: 100
              // });
              self.projectList();
            } else {
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: '删除失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {
          this.$notify.error({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //确定
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.clickType == 1) {
              let data = Object.assign({
                longitude: this.addLng,
                latitude: this.addLat
              }, this.formAdd);
              data.startDate = data.startDate.Format("yyyy-MM-dd");
              data.completionDate = data.completionDate.Format("yyyy-MM-dd");
              this.adddialogTableVisible = false;
              createProject(data).then((res) => {
                if (res.data.code == 0) {
                  myCallback.call(this,res)
                  // this.$notify.success({
                  //   title: '操作成功',
                  //   // message: res.data.msg,
                  //   // offset: 100
                  // });
                  this.$refs['formAdd'].resetFields();
                  this.$root.eventHub.$emit('getMenuList', Math.random());
                } else {
                  myCallback.call(this,res)
                  // this.$notify.error({
                  //   title: '操作失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              })
            }
            if (this.clickType == 2) {
              let data = Object.assign({id: this.projectManagerOptionId}, this.formAdd);
              data.startDate = data.startDate.Format("yyyy-MM-dd");
              data.completionDate = data.completionDate.Format("yyyy-MM-dd");
              debugger
              this.adddialogTableVisible = false;
              debugger
              updateProject(data).then((res) => {
                if (res.data.code == 0) {
                  myCallback.call(this,res)
                  // this.$notify.success({
                  //   title: '操作成功',
                  //   // message: res.data.msg,
                  //   // offset: 100
                  // })
                  debugger
                  this.$refs[formName].resetFields();
                  this.projectList();
                  debugger
                } else {
                  myCallback.call(this,res)
                  // this.$notify.error({
                  //   title: '操作失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              })
              this.jiluForm = {
                unitId: '',
                projectCommissioner: {},
                projectManager: {}
              }
              this.clearMapSearchInput();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      resetForm() {
        this.adddialogTableVisible = false;
        this.$refs['formAdd'].resetFields();
        this.addMarkers = [];
        this.clearMapSearchInput();
        this.addLng = '';
        this.addLat = '';
      },
      // 清除地图上的搜索
      clearMapSearchInput() {
        let oMapSearchBox = document.querySelector('.search-box-wrapper input');
        oMapSearchBox.value = '';
      },
      // 获取公司列表
      getCompany() {
        allBranchList().then((res) => {
          if (res.data.code == 0) {
            this.workerList = res.data.data;
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取公司列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      /*
      * 获省市县   开始
      * */
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
      /*
      * 获省市县    结束
      * */
      //查询条件的 搜索作业所负责人
      remoteMethod3(query) {
        var self = this;
        self.projectCommissionerloading = true;
        if (query == '') {
          self.projectCommissioner2 = [];
          return;
        }

        if (query.length < 5) {
          self.projectCommissioner2 = [];
          return;
        }
        var data = {
          key: query,
          roleCode: 'PROJECT_ADMIN',
          unitId: self.project.projectId,
          pageNum: 1,
          pageSize: 10,
          simple: true
        }
        fuzzyQuery(data).then((res) => {
          if (res.data.code == 0) {
            self.projectCommissioner2 = res.data.data.list;
            self.projectCommissionerloading = false;
          } else {
            self.projectCommissionerloading = false;
            myCallback.call(self,res)
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //搜索作业所负责人
      remoteMethod(query) {
        var self = this;
        self.projectCommissionerloading = true;
        if (this.formAdd.unitId == '') {
          this.$notify.error({
            title: '请先选择所属公司',
            message: '',
            offset: 100
          });
          return;
        }
        if (query == '') {
          self.projectCommissioner = [];
          self.projectCommissionerloading = false;
          return;
        }

        if (query.length < 5) {
          self.projectCommissioner = [];
          return;
        }
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
            self.projectCommissioner = res.data.data.list;
            self.projectCommissionerloading = false;
          } else {
            self.projectCommissionerloading = false;
            myCallback.call(self,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //搜索项目管理员
      remoteMethod2(query) {
        var self = this;
        self.projectManagerloading = true;
        if (this.formAdd.unitId == '') {
          this.$notify.error({
            title: '请先选择所属公司',
            message: '',
            offset: 100
          });
          return;
        }
        if (query.length < 5) {
          self.projectManagerOption = [];
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
              self.projectManagerOption = res.data.data.list;
              self.projectManagerloading = false;
            } else {
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        } else {
          self.projectManagerOption = [];
        }
      },
      browser() {
        // var sUserAgent = navigator.userAgent;
        // var isChrome = sUserAgent.indexOf("Chrome") > -1;
        var browser = {
          versions: function () {
            var sUserAgent = navigator.userAgent;
            return {//移动终端浏览器版本信息
              trident: sUserAgent.indexOf('Trident') > -1, //IE内核
              presto: sUserAgent.indexOf('Presto') > -1, //opera内核
              webKit: sUserAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
              gecko: sUserAgent.indexOf('Gecko') > -1 && sUserAgent.indexOf('KHTML') == -1, //火狐内核
              mobile: !!sUserAgent.match(/AppleWebKit.*Mobile.*/) || !!sUserAgent.match(/AppleWebKit/), //是否为移动终端
              ios: !!sUserAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
              android: sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Linux') > -1, //android终端或者uc浏览器
              iPhone: sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
              iPad: sUserAgent.indexOf('iPad') > -1, //是否iPad
              webApp: sUserAgent.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
          }(),
          language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        if (!(browser.versions.webKit)) {
          this.downloadShow = true;
        }
      },
      downloadFileBrowser() {
        if (/macintosh|mac os x/i.test(navigator.userAgent) && !navigator.userAgent.includes('iPad')) {
          window.open('../../../static/googlechrome.dmg')
        } else if (/windows|win32/i.test(navigator.userAgent)) {
          window.open('../../../static/ChromeSetup.exe')
        } else if (/iPhone|iPad/i.test(navigator.userAgent)) {
          window.open('https://itunes.apple.com/cn/app/chrome/id535886823')
        }
        this.downloadShow = false;
      },
    }
  }
</script>
<style scoped>
  .dataStatistics {
    background: #eee;
    padding: .2rem .1rem;
  }

  .dataStatistics .businessCard {
    width: calc(100% - 9.6rem);
    height: 4rem;
    min-width: 2rem;
    float: left;
    margin-right: .3rem;
    text-align: left;
    border-radius: 5px;
  }

  .dataStatistics .businessCard .topBox {
    height: 1rem;
    line-height: 1rem;
    width: 100%;
    position: relative;
    border-bottom: 1px solid #ccc;
  }

  .dataStatistics .businessCard .headPhoto {
    width: .8rem;
    height: .8rem;
    position: absolute;
    top: 50%;
    margin-top: -.4rem;
    cursor: pointer;
    left: .2rem;
    border-radius: 50%;
  }

  .dataStatistics .businessCard .topBox p {
    width: 50%;
    float: left;
    font-size: .16rem;
  }

  .dataStatistics .businessCard .topBox p:first-child {
    font-size: .17rem;
  }

  .dataStatistics .businessCard .bottomBox {
    height: 1rem;
    line-height: 1rem;
    width: 100%;
    border-bottom: 1px solid #ccc;
    position: relative;
  }

  .dataStatistics .businessCard .bottomBox .cardIcon {
    width: .25rem;
    height: .25rem;
    position: absolute;
    left: 14%;
    top: .38rem;
  }

  .dataStatistics .businessCard .bottomBox:last-child {
    border: none;
  }

  .dataStatistics .businessCard .bottomBox i {
    position: absolute;
    left: 15%;
    top: .43rem;
    font-size: .16rem;
  }

  .dataStatistics .businessCard .bottomBox p {
    position: absolute;
    left: 30%;
    top: 0;
    font-size: .17rem;
  }

  .dataStatistics .headSummary {
    height: 1.2rem;
    /*min-width: 1024px;*/
    margin-bottom: .2rem;
  }

  .dataStatistics .headSummary .childHeadSummary {
    width: 19%;
    float: left;
    height: 100%;
    margin-right: 1%;
    background: #fff;
    position: relative;

  }

  .dataStatistics .headSummary .childHeadTitle {
    font-size: .13rem;
    top: .3rem;
    position: absolute;
    left: .4rem;
  }

  .dataStatistics .headSummary .childHeadNum {
    top: .6rem;
    position: absolute;
    left: .5rem;
    font-size: .24rem;
  }

  .dataStatistics .headSummary .childHeadIcon {
    width: 18px;
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .dataStatistics .item li {
    float: left;
    width: 240px;
    height: 170px;
    margin: 10px;
    line-height: 120px;
    color: #fff;
    text-align: center;
    font-size: 30px;
  }

  .dataStatistics .dataDateChange {
    position: absolute;
    right: 40px;
    width: 100px;
    top: 2px;
    z-index: 1;
  }

  .dataStatistics .dataDateChange p {
    width: 50%;
    float: left;
    font-size: 12px;
    cursor: pointer;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }

  .dataStatistics .dataDateChange .activeDateClass {
    color: #2993f5;
  }

  .dataStatistics .maskStr {
    position: absolute;
    font-size: .12rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    height: .35rem;
    line-height: .3rem;
    width: .8rem;
    left: .2rem;
    top: .55rem;
    z-index: 99;
    border-radius: 0 0 .47rem .47rem;
    display: none;

  }

  .dataStatistics .headBox {
    overflow: hidden;
    display: block;
    width: 1.2rem;
    height: 100%;
  }

  .dataStatistics .headBox:hover .maskStr {
    display: block;
    cursor: pointer;
    text-align: center;
  }

  .projectList {
    overflow: hidden;
  }

  .query {
    height: 1rem;
    margin-top: .1rem;
    padding: 6px;
    position: relative;
  }

  .term, .time {
    font-size: .12rem;
    height: .4rem;
    /*min-width: 1000px;*/
    padding: .05rem;
  }

  .term {
    margin-bottom: 10px;
  }

  .term_item {
    float: left;
    height: .4rem;
    line-height: .4rem;
    max-width: 3.5rem;
    margin-right: .1rem;
  }

  .time_item {
    float: left;
    height: .4rem;
    line-height: .4rem;
    max-width: 3.8rem;
    margin-right: .1rem;
  }

  .time {
    padding-top: 0px;
  }

  .width635 {
    width: 730px;
  }

  .titleChrome {
    display: inline-block;
    width: 70%;
    height: 100%;
    text-align: center;
    vertical-align: top;
    line-height: .4rem;
    color: #fff;
    font-size: 16px;
  }

  .downloadfile {
    font-size: 14px;
    display: inline-block;
    height: .3rem;
    color: #fff;
    border: 1px solid #66b1ff;
    margin-top: .06rem;
    padding: .05rem .07rem;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #66b1ff;
    font-weight: bold;
    cursor: pointer;
  }
  .demo-input-suffix {
    font-size: .12rem;
  }

  .childheadNumyoun {
    font-size: .14rem;
  }
  .headBoxYoung {
    font-size: .18rem;
  }
  .headBoxYoungOne {
    font-size: .15rem;
  }

  /*@media screen and (min-width: 1920px) {*/
    /*.dataStatistics[data-v-512bdd6d] {*/
      /*background: #eee;*/
      /*padding: 20px 10px;*/
    /*}*/
    /*.dataStatistics .headSummary {*/
      /*height: 120px;*/
      /*!* min-width: 1024px; *!*/
      /*margin-bottom: 20px;*/
    /*}*/
    /*.dataStatistics .headSummary .childHeadTitle {*/
      /*font-size: 13px;*/
      /*top: 30px;*/
      /*position: absolute;*/
      /*left: 40px;*/
    /*}*/
    /*.dataStatistics .headSummary .childHeadNum {*/
      /*top: 60px;*/
      /*position: absolute;*/
      /*left: 50px;*/
      /*font-size: 24px;*/
    /*}*/
    /*.childheadNumyoun {*/
      /*font-size: 14px;*/
    /*}*/
    /*.dataStatistics .businessCard[data-v-512bdd6d] {*/
      /*width: calc(100% - 9.6rem);*/
      /*height: 4rem;*/
      /*min-width: 2rem;*/
      /*float: left;*/
      /*margin-right: .3rem;*/
      /*text-align: left;*/
      /*border-radius: 5px;*/
    /*}*/
    /*.dataStatistics .businessCard .topBox p:first-child {*/
      /*font-size: 17px;*/
    /*}*/
    /*.headBoxYoung {*/
      /*font-size: 18px;*/
    /*}*/
    /*.headBoxYoungOne {*/
      /*font-size: 15px;*/
    /*}*/
    /*.dataStatistics .headBox[data-v-512bdd6d] {*/
      /*overflow: hidden;*/
      /*display: block;*/
      /*width: 120px;*/
      /*height: 100%;*/
    /*}*/
    /*.dataStatistics .maskStr {*/
      /*position: absolute;*/
      /*font-size: 12px;*/
      /*color: #fff;*/
      /*background: rgba(0, 0, 0, 0.3);*/
      /*height: 35px;*/
      /*line-height: 30px;*/
      /*width: 80px;*/
      /*left: 20px;*/
      /*top: 55px;*/
      /*z-index: 99;*/
      /*border-radius: 0 0 47px 47px;*/
      /*display: none;*/
    /*}*/
    /*.dataStatistics .businessCard .headPhoto[data-v-512bdd6d] {*/
      /*width: 80px;*/
      /*height: 80px;*/
      /*position: absolute;*/
      /*top: 50%;*/
      /*margin-top: -40px;*/
      /*cursor: pointer;*/
      /*left: 20px;*/
      /*border-radius: 50%;*/
    /*}*/
  /*}*/

</style>
<style>
  .nodeDownload .macDownload {
    display: block;
    float: left;
    width: 100px;
    margin-right: 20px;
  }

  .nodeDownload .windowDownload {
    display: block;
    float: left;
    width: 1.2rem;
    margin-right: .2rem;
  }

  .nodeDownload {
    position: fixed;
    top: .45rem;
    left: 0;
    width: 100%;
    height: .4rem;
    background-color: #e6a23c;
    box-sizing: border-box;
    font-size: 0rem;
    z-index: 999;
  }

  .amap-demo {
    margin-top: 0 !important;
    position: relative;
    min-height: 320px !important;
  }

  .addMap .el-vue-amap {
    min-height: 320px !important;
  }

  .el-vue-search-box-container {
    position: absolute !important;
    top: 10px;
    left: 10px;
    width: 94% !important;
  }

  .amap-page-container {
    position: relative;
    margin: 0 0 .1rem;
    left: 10%;
    padding-right: .1rem;
    box-sizing: border-box;
  }
  .el-range-editor--small.el-input__inner {
    height: .32rem !important;
    line-height: .32rem;
  }
  .el-range-editor--small .el-range__icon {
    line-height: .24rem;
  }
  .el-range-editor--small .el-range-separatorv {
    font-size: .13rem !important;
    line-height: .24rem !important;
  }
  .el-date-editor .el-range-separator {
    padding: 0 .05rem;
    font-size: .13rem;
    line-height: .24rem;
  }
  .term_item {
    /*width: 3rem;*/
    /*margin-right: .1rem;*/
  }

  .el-range-editor--small .el-range-input {
    font-size: .14rem;
  }
  .el-range-editor.el-input__inner {
    padding: .03rem .1rem !important;
    /*vertical-align: middle;*/
    /*box-sizing: border-box;*/
  }
  .el-input--small .el-input__icon {
    line-height: .32rem !important;
  }

  .el-dropdown-menu {
    padding:  .1rem 0;
  }
  .el-dropdown-menu__item {
    line-height: .36rem;
    padding: 0 .2rem;
    font-size: .14rem;
  }
  .el-pagination button, .el-pagination span:not([class*=suffix]) {
    display: inline-block;
    font-size: .13rem;
    min-width: .355rem;
    height: .28rem;
    line-height: .28rem;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-input--mini {
    font-size: .12rem;
  }
  .el-pagination .el-select .el-input{
    width: 1rem;
    margin: 0 .05rem;
  }
  .el-pagination__sizes .el-input .el-input__inner {
    font-size: .12rem;
    padding-left: .08rem;
  }
  .el-pagination__sizes .el-input .el-input__inner{
    height: .28rem;
    line-height: .28rem;
  }
  .el-input--mini .el-input__icon{
    line-height: .28rem;
  }
  .el-select .el-input .el-select__caret {
    font-size: .14rem;
  }
  .el-pager li {
    padding: 0 .04rem;
    background: #fff;
    font-size: .13rem;
    min-width: .355rem;
    height: .28rem;
    line-height: .28rem;
    box-sizing: border-box;
  }
  .el-pagination__editor.el-input {
    width: .5rem;
  }
  .el-input {
    font-size: .14rem;
  }
  .el-pagination__editor {
    line-height: .18rem;
    padding: 0 .02rem;
    height: .28rem;
    margin: 0 .02rem;
    box-sizing: border-box;
    border-radius: 3px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    height: .28rem;
  }
  .el-pagination__editor.el-input .el-input__inner {
    line-height: .28rem;
  }
  .el-date-editor .el-range-separator {
    width: 11%;
  }
  .el-message-box__message p{
    line-height: .24rem;
  }
  .el-message-box__title {
    font-size: .18rem;
  }
  .el-message-box__content {
    font-size: .14rem;
  }
  .el-message-box__headerbtn {
    font-size: .14rem;
  }
  .el-dialog__headerbtn {
    font-size: .16rem;
  }
  .el-loading-spinner .el-loading-text {
    font-size: .14rem;
  }
  .el-table {
    font-size: .14rem;
  }
  .el-step__title {
    font-size: .16rem;
    line-height: .38rem;
  }
  .el-step__icon {
    font-size: .14rem;
  }
  .el-step__icon {
    width: .24rem;
    height: .24rem;
  }
  .el-step__icon.is-text {
    border: .02rem solid;
  }
  .el-step.is-horizontal .el-step__line {
    height: .02rem;
    top: .11rem;
  }
  .el-dialog__title {
    line-height: .3rem;
  }
  .el-select-dropdown__empty {
    padding: .1rem 0;
    font-size: .14rem;
  }
  /*@media screen and (min-width: 1920px) {*/
    /*.el-input {*/
      /*font-size: 14px !important;*/
    /*}*/
  /*}*/
  .avatar-cropper .avatar-cropper-close {
    font-size: .5rem !important;
  }
</style>
