<template>
  <div id="projectManager">
    <!--flash-->
    <!--<div v-show="oneLogin" style="position: fixed;left: 0;top: 0;z-index: 9999" id="webcam2"></div>-->
    <!--添加项目-->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="addtitle"
               :visible.sync="adddialogTableVisible" width="1100px" :before-close="resetForm">
      <el-form :model="formAdd" :rules="rulesAdd" ref="formAdd" label-width="150px" class="demo-ruleForm" :inline="true"
               size="small">
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
            <el-form-item class="width635" label="项目地址" prop="localLength">
              <el-select style="width: 120px;" v-model="formAdd.provinceId" placeholder="请选择省"
                         @change="editGetPro(formAdd.provinceId)" @visible-change="proHasChanges" size="small">
                <el-option
                  v-for="item in Province"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 120px;" v-model="formAdd.cityId"
                         @change="editGetProCity(formAdd.cityId)" v-show="showNext" @visible-change="cityHasChanges"
                         placeholder="请选择市">
                <el-option
                  v-for="item in City"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 120px;" v-model="formAdd.countyId" v-show="showNext"
                         placeholder="请选择县">
                <el-option
                  v-for="item in Country"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input placeholder="详细地址" size="small" style="width: 200px;" :maxlength="50"
                        v-model="formAdd.address"></el-input>
            </el-form-item>

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
            <el-form-item label="所属分公司" prop="unitId">
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
        <div style="width: 100%;overflow: hidden">
          <div style="width: 50%;float: left;">
            <p style="border-bottom: 1px solid #ebeef5;width: 90%;padding-left: 10px;margin-bottom: 10px;"> 作业所负责人信息</p>
            <el-form-item label="用户名" prop="projectCommissionerId">
              <el-select
                v-model="formAdd.projectCommissionerId"
                filterable
                remote
                clearable
                style="width: 200px;"
                size="small"
                reserve-keyword
                @change="setname"
                @focus="removeReadOnly($event)"
                placeholder="企业邮箱"
                loading-text="请输入最少5位"
                :remote-method="remoteMethod" :loading="projectCommissionerloading">
                <el-option
                  v-for="item in projectCommissioner"
                  :key="item.id"
                  :label="item.loginname"
                  :value="item.id">
                  <span style="float: left">{{ item.loginname }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业所负责人姓名">
              <el-input size="small" :disabled="true" style="width: 200px;" placeholder="作业所负责人姓名"
                        v-model="formAdd.projectCommissionerName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input size="small" :disabled="true" style="width: 200px;" placeholder="联系方式"
                        v-model="formAdd.projectCommissionerPhone"></el-input>
            </el-form-item>

          </div>

          <div style="width: 50%;float: left;">
            <p style="border-bottom: 1px solid #ebeef5;width: 90%;margin-bottom: 10px;"> 项目管理员信息</p>
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
                placeholder="企业邮箱"
                loading-text="请输入最少5位"
                @focus="removeReadOnly($event)"
                :remote-method="remoteMethod2" :loading="projectManagerloading">
                <el-option
                  v-for="item in projectManagerOption"
                  :key="item.id"
                  :label="item.loginname"
                  :value="item.id">
                  <span style="float: left">{{ item.loginname }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目管理员姓名">
              <el-input size="small" :disabled="true" style="width: 200px;" placeholder="项目管理员姓名"
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
    <div v-if="contentState==0" class="projectList">
      <div
        v-if="contains(roles,'HEAD_OFFICE_ADMIN') || contains(roles,'BRANCH_ADMIN') || contains(roles,'PROJECT_ADMIN') || contains(roles,'PROJECT_COMMISSIONER')">
        <el-button size="small" type="primary" @click="addEdit(1,null)">创建新项目</el-button>
      </div>

      <!--查询-->
      <div class="query">
        <ul class="term">
          <li class="term_item">
            <div class="demo-input-suffix">
              项目名称：
              <el-input
                placeholder="项目名称"
                style="width: 200px;"
                :maxlength="100"
                size="small"
                v-model="queryFrom.projectName">
              </el-input>
            </div>
          </li>
          <li class="term_item">
            <div class="demo-input-suffix">
              作业所负责人：
              <el-select
                v-model="queryFrom.projectCommissionerId"
                filterable
                remote
                clearable
                style="width: 200px;"
                size="small"
                reserve-keyword
                placeholder="企业邮箱"
                @focus="removeReadOnly($event)"
                :remote-method="remoteMethod3"
                :loading="projectCommissionerloading"
                loading-text="请输入最少5位"
              >
                <el-option
                  v-for="item in projectCommissioner2"
                  :key="item.id"
                  :label="item.loginname"
                  :value="item.id">
                  <span style="float: left">{{ item.loginname }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="term_item">
            <div class="demo-input-suffix">
              项目状态：
              <el-select
                style="width: 200px;"
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
                style="width: 250px;"
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
                style="width: 250px;"
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
        <el-button style="position: absolute;right: 10px;bottom: 10px;" size="small" type="primary"
                   icon="el-icon-search" @click="projectList">搜索
        </el-button>
        <el-button size="small" style="position: absolute;right: 110px;bottom: 10px;" @click="reset"
                   icon="el-icon-refresh">重置
        </el-button>
      </div>

      <!--列表-->
      <ul class="tableBox">
        <li class="tableChild" v-for="item in tableData">
          <div v-if="item.approvalstates.number == 0">
            <img class="tableIcon" src="../../../static/img/waitbuild.png"/>
            <div class="tableName" @click="addEdit(2,item.id)">{{item.name}}</div>
            <div class="tableType">{{item.projecttypename}}</div>
            <div class="showBody">
              <p>作业所负责人: {{item.projectcommissionername}}</p>
              <p>项目开工日期: {{item.startdate}}</p>
              <p>项目竣工日期: {{item.completiondate}}</p>
            </div>
          </div>
          <div v-else-if="item.approvalstates.number == 1">
            <img style="width: 40px; height: 40px; left: 0;" class="tableIcon" src="../../../static/img/build.png"/>
            <div class="tableName" @click="changecontentState(item.id)">{{item.name}}</div>
            <div class="tableType">{{item.projecttypename}}</div>
            <div class="showBody">
              <p>作业所负责人: {{item.projectcommissionername}}</p>
              <p>项目开工日期: {{item.startdate}}</p>
              <p>项目竣工日期: {{item.completiondate}}</p>
            </div>
          </div>
          <div v-else>
            <img class="tableIcon" src="../../../static/img/builded.png"/>
            <div class="tableName" @click="addEdit(2,item.id)">{{item.name}}</div>
            <div class="tableType">{{item.projecttypename}}</div>
            <div class="showBody">
              <p>作业所负责人: {{item.projectcommissionername}}</p>
              <p>项目开工日期: {{item.startdate}}</p>
              <p>项目竣工日期: {{item.completiondate}}</p>
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        style="float: right;margin-top: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
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
  import {getUserCompany, getProjcetList, topBranchList, getAdmin} from '../../api/api';
  import Project from './project.vue'

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
          return callback(new Error('所属分公司不能为空'));
        }
        callback();
      };
      var localL = (rule, value, callback) => {
        if (this.formAdd.provinceId == 810000 || this.formAdd.provinceId == 820000 || this.formAdd.provinceId == 710000) {
          if (this.formAdd.provinceId == '') {
            return callback(new Error('请选择省/直辖市'));
          }
          callback();
        } else {
          if (this.formAdd.provinceId == '') {
            return callback(new Error('请选择省/直辖市'));
          }
          if (this.formAdd.cityId == '') {
            return callback(new Error('请选择市/区域'));
          }
          if (this.formAdd.countyId == '') {
            return callback(new Error('请选择县/区'))
          }
          if (this.formAdd.address == '') {
            return callback(new Error('详细地址不能为空'));
          }
          callback();
        }
      };
      var localL2 = (rule, value, callback) => {
        if (this.formAdd.unitId == '') {
          this.formAdd.projectCommissionerId = ''
          this.formAdd.projectCommissionerName = '';
          this.formAdd.projectCommissionerPhone = '';
          return callback(new Error('请先选择所属分公司'));
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
          return callback(new Error('请先选择所属分公司'));
        }
        if (this.formAdd.projectManagerId == '') {
          return callback(new Error('项目管理员不能为空'));
        }
        callback();
      };
      return {
        //展示内容
        contentState: 0,
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
          projectCommissionerId: '',
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
          localLength: [
            {required: true, validator: localL, trigger: 'blur'}
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
    watch: {
      project: {
        handler: function (val, oldVal) {
          this.contentState = 0;
          this.projectList();
          this.isone = true;

        },
        deep: true
      },
    },
    created() {
      getAdmin().then((res) => {
        console.log(res)
        if (!res) {
          return;
        }
        if (res.data.code == 0) {
          var arr = res.data.data.roles;
          var arr2 = []
          for (var i = 0; i < arr.length; i++) {
            arr2.push(arr[i].code)
          }
          this.roles = arr2;
        } else {
          this.$notify.error({
            title: '获取项目类型失败',
            message: res.data.msg,
            offset: 100
          });
        }
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
    components: {
      Project
    },
    mounted() {

      // 获取所有省
      this.getALlPro();
      // 获取公司列表
      this.getCompany();
      // 获取项目类型
      this.getList();
      //获取项目列表
      var self = this;
      setTimeout(function () {
        if (!self.isone) {
          self.projectList();
        }
      }, 300)
    },
    methods: {
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
      },
      //返回项目列表
      goList() {
        if (this.contentState != 0) {
          this.contentState = 0;
        }
      },
      //进入项目操作
      changecontentState(id) {
        this.contentState = 1;
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
          projectCommissionerId: '',
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
          if (!res) {
            return;
          }
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
                projectcommissionername: arr[i].projectcommissionername,
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
            this.$notify.error({
              title: '获取列表失败',
              message: res.data.msg,
              offset: 100
            });
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
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.projectTypeOption = res.data.data;
          } else {
            this.$notify.error({
              title: '获取项目类型失败',
              message: res.data.msg,
              offset: 100
            });
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
              console.log(json)
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
                projectCommissionerName: json.projectCommissioner.username,
                projectCommissionerPhone: json.projectCommissioner.phone,
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
              this.$notify.error({
                title: '获取项目信息失败',
                message: res.data.msg,
                offset: 100
              });
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
          var data = {projectId: id}
          delProject(data).then((res) => {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '删除成功!'
              });
              self.projectList();
            } else {
              this.$notify.error({
                title: '删除失败',
                message: res.data.msg,
                offset: 100
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //确定
      submitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.clickType == 1) {
              var data = Object.assign({}, this.formAdd);
              data.startDate = data.startDate.Format("yyyy-MM-dd");
              data.completionDate = data.completionDate.Format("yyyy-MM-dd");
              self.adddialogTableVisible = false;
              createProject(data).then((res) => {
                if (res.data.code == 0) {
                  this.$notify.success({
                    title: '创建新项目成功',
                    // message: res.data.msg,
                    // offset: 100
                  });
                  self.$refs['formAdd'].resetFields();
                  self.projectList();
                } else {
                  this.$notify.error({
                    title: '创建新项目失败',
                    message: res.data.msg,
                    offset: 100
                  });
                }
              })
            }
            if (this.clickType == 2) {
              var data = Object.assign({id: this.projectManagerOptionId}, this.formAdd);
              data.startDate = data.startDate.Format("yyyy-MM-dd");
              data.completionDate = data.completionDate.Format("yyyy-MM-dd");
              self.adddialogTableVisible = false;
              updateProject(data).then((res) => {
                if (res.data.code == 0) {
                  self.$message({
                    type: 'success',
                    message: '编辑项目成功!'
                  });
                  self.$refs[formName].resetFields();
                  self.projectList();
                } else {
                  this.$notify.error({
                    title: '编辑项目失败',
                    message: res.data.msg,
                    offset: 100
                  });
                }
              })
              this.jiluForm = {
                unitId: '',
                projectCommissioner: {},
                projectManager: {}
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      resetForm(formName) {
        this.$refs['formAdd'].resetFields();
        this.adddialogTableVisible = false;

      },
      // 获取公司列表
      getCompany() {
        allBranchList().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.workerList = res.data.data;
          } else {
            this.$notify.error({
              title: '获取公司列表失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      /*
      * 获省市县   开始
      * */
      // 获取所有省
      getALlPro() {
        getProvince().then((res) => {
          if (!res) {
            return;
          }
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
          roleCode: 'PROJECT_COMMISSIONER',
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
            this.$notify.error({
              title: '失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //搜索作业所负责人
      remoteMethod(query) {
        var self = this;
        self.projectCommissionerloading = true;
        if (this.formAdd.unitId == '') {
          this.$notify.error({
            title: '请先选择所属分公司',
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
          roleCode: 'PROJECT_COMMISSIONER',
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
            this.$notify.error({
              title: '失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //搜索项目管理员
      remoteMethod2(query) {
        var self = this;
        self.projectManagerloading = true;
        if (this.formAdd.unitId == '') {
          this.$notify.error({
            title: '请先选择所属分公司',
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
              this.$notify.error({
                title: '失败',
                message: res.data.msg,
                offset: 100
              });
            }
          })
        } else {
          self.projectManagerOption = [];
        }
      },

    },
  }
</script>
<style scoped>
  #projectManager .query {
    height: 100px;
    margin-top: 10px;
    padding: 6px;
    position: relative;
  }

  .term, .time {
    font-size: 12px;
    height: 40px;
    min-width: 1000px;
    padding: 5px;
  }

  .term {
    margin-bottom: 10px;
  }

  .term_item {
    float: left;
    height: 40px;
    line-height: 40px;
    width: 300px;
  }

  .time_item {
    float: left;
    height: 40px;
    line-height: 40px;
    width: 324px;
  }

  .time {
    padding-top: 0px;
  }

  .width635 {
    width: 730px;
  }

  .tableBox {
    width: 100%;
  }

  .tableBox .tableChild {
    width: 100%;
    height: 70px;
    position: relative;
    border-bottom: 1px solid #ddd;
    margin: 10px 0;
  }

  .tableBox .tableChild .tableIcon {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 5px;
    left: 10px;
  }

  .tableBox .tableChild .tableName {
    width: 800px;
    position: absolute;
    left: 105px;
    top: 5px;
    font-size: 25px;
    color: rgb(44, 50, 68);
    cursor: pointer;
  }

  .tableBox .tableChild .tableType {
    padding: 1px 10px;
    background: cornflowerblue;
    position: absolute;
    left: 40px;
    top: 13px;
    font-size: 12px;
    color: #fff;
    border-radius: 10px;
  }

  .tableBox .tableChild .showBody {
    position: absolute;
    top: 50px;
    left: 140px;
  }

  .tableBox .tableChild .showBody p {
    width: 200px;
    float: left;
    text-align: left;
    margin-right: 80px;
    font-size: 13px;
  }
</style>
