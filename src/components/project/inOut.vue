<template>
  <div class="inoutbox">
    <!--图片查看-->
    <el-dialog id="photoSee" title="照片" top="30vh" :visible.sync="photoVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <img style="width: 3.6rem;" v-if="photoVisible"
           :src="imgSrc(photoId)" alt="">
    </el-dialog>
    <div style="position: relative;padding-left: .2rem;padding-bottom: .1rem;">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item label="姓名">
          <el-input style="margin-left: .35rem" placeholder="请输入姓名" v-model="queryForm['search.name']"></el-input>
        </el-form-item>
        <!--<br>-->
        <el-form-item style="margin-left: .3rem;" label="进出方式：">
          <el-select style="width: 1rem;" v-model="queryForm['search.type']" @change="typeChange" placeholder="请选择"
                     size="small">
            <el-option
              v-for="item in typeOption"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="queryForm['search.type']=='1'" label="工友：">-->
          <!--<el-select-->
            <!--v-model="queryForm['search.workerManId']"-->
            <!--filterable-->
            <!--remote-->
            <!--clearable-->
            <!--style="width: 2rem;"-->
            <!--size="small"-->
            <!--@focus="removeReadOnly($event)"-->
            <!--placeholder="请输入工友身份证号"-->
            <!--:remote-method="getWorkManList"-->
            <!--:loading="workerTeamOptionloading"-->
            <!--:loading-text="workerloadingText"-->
            <!--@blur="toFalse">-->
            <!--<el-option-->
              <!--v-for="item in workerManOption"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
              <!--<span style="">{{ item.name }}</span>-->
              <!--<span style="color: #8492a6; font-size: .13rem">{{ item.idCardNo }}</span>-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="queryForm['search.type']=='2'" label="管理人员：">-->
          <!--<el-select-->
            <!--v-model="queryForm['search.specialPersonId']"-->
            <!--filterable-->
            <!--remote-->
            <!--clearable-->
            <!--style="width: 2rem;"-->
            <!--size="small"-->
            <!--@focus="removeReadOnly($event)"-->
            <!--placeholder="请输入姓名"-->
            <!--:remote-method="getProjectManList"-->
            <!--:loading="projectTeamOptionloading"-->
            <!--:loading-text="projectLoadingText"-->
            <!--@blur="toFalse">-->
            <!--<el-option-->
              <!--v-for="item in projectManOption"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
              <!--<span style="margin-right: .1rem;">{{ item.name }}</span>-->
              <!--<span style="color: #8492a6; font-size: .13rem;">{{ item.idCardNo }}</span>-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<br>-->
        <el-form-item label="是否放行：">
          <el-select style="width: 1rem;" v-model="queryForm['search.validPass']" placeholder="请选择" size="small">
            <el-option
              v-for="item in passOption"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="进/出：">-->
          <!--<el-select style="width: 1rem;" v-model="queryForm['search.inOutType']" placeholder="请选择" size="small">-->
            <!--<el-option-->
              <!--v-for="item in inOutOption"-->
              <!--:label="item.name"-->
              <!--:key="item.id"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <br>
        <el-form-item label="日期范围：">
          <el-date-picker
            v-model="time"
            type="daterange"
            size="small"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button style="position: absolute;left: 5.4rem;bottom: 0.16rem;};" size="small" @click="reset"
                   icon="el-icon-refresh">重置
        </el-button>
        <el-button style="position: absolute;left: 6.20rem;bottom: 0.16rem;};" size="small" type="primary"
                   icon="el-icon-search" @click="getList">搜索
        </el-button>
      </el-form>
    </div>
    <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              style="width: 100%">
      <el-table-column label="现场照片" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <img style="cursor: pointer;width: 1rem;" @click="seePhoto(scope.row.livePhotoPathByBase64)"
               :src="`/workerman/accessRecord/showFileByBase64?photoPathByBase64=${scope.row.livePhotoPathByBase64}&tokenId=${tokenId}&tokenStr=${tokenStr}`"
               alt="">
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       label="角色" align="center">
        <template scope="scope">
          <p>{{ scope.row.roleName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="设备唯一标识" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <!--<p @click="showLogs(scope.row.equipmentId)"-->
          <!--style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">-->
          <!--{{ scope.row.equipment ? scope.row.equipment.uniqueIdentity : '' }}</p>-->
          <p>{{ scope.row.equipment ? scope.row.equipment.uniqueIdentity : '' }}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       label="人员姓名" align="center">
        <template scope="scope">
          <p @click="lookThis(scope.row)"
             style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">
            {{ scope.row.name ? scope.row.name : ''}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="进出类型" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.type }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="是否放行" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.isPass}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="记录方式" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.isOffline ? '补录' : '正常' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="是否为考勤记录" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.isCheck ? '是' : '否' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="验证不通过原因" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.noPassMsg }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="时间" :show-overflow-tooltip="true" align="center">
        <template scope="scope">
          <p>{{ scope.row.recordDTIME}}</p>
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

    <!-- 查看设备日志 -->
    <el-dialog title="设备日志列表" :visible.sync="logsVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table stripe v-loading="logsLoading" element-loading-text="拼命加载中"
                :data="logsData"
                style="margin-bottom: .2rem;"
                border>
        <el-table-column
          label="日志名字"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.name ? scope.row.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日志大小"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.fileSize ? scope.row.fileSize : ''}} kb</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="logsDownload(scope.row)">日志下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--
        查看
     -->
    <el-dialog class="wokerBox" v-if="lookForm.id" title="工友详情" :before-close="lookCancelBtn"
               :visible.sync="lookCencelVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               width="10rem">
      <el-form :model="lookForm" label-width="1.1rem" style="overflow: hidden;" ref="editForm">
        <div style="width:50%;position:relative;float: left;">
          <img v-if="lookForm.workerMan.idCardPhotoId"
               style="position:  absolute;width: 1.15rem; right: -.5rem; top: -.03rem;"
               :src="`/workerman/fileupload/pageShowFile?fid=${lookForm.workerMan.idCardPhotoId}`"/>
          <img v-else="lookForm.workerMan.idCardPhotoId" style="position:  absolute; right:.1rem; top: .1rem;"
               src="../../../static/img/img.jpg"/>
          <el-form-item label="姓名：" style="width: 65%;">
            <p v-if="lookForm.workerMan.name">{{lookForm.workerMan.name}}</p>
          </el-form-item>
          <el-form-item label="性别：" style="width: 65%;">
            <p>{{lookForm.workerMan.sex}}</p>
          </el-form-item>
          <el-form-item label="民族：" style="width: 65%;">
            <p>{{lookForm.workerMan.nation}}</p>
          </el-form-item>
          <el-form-item label="出生日期：">
            <p>{{lookForm.workerMan.birthDate}}</p>
          </el-form-item>
          <el-form-item label="住址：">
            <p>{{lookForm.workerMan.address}}</p>
          </el-form-item>
          <el-form-item label="身份证号：">
            <p>{{lookForm.workerMan.idCardNo}}</p>
          </el-form-item>
          <el-form-item label="签发机关：">
            <p>{{lookForm.workerMan.idCardOrg}}</p>
          </el-form-item>
          <el-form-item label="签发日期：">
            <p>{{lookForm.workerMan.isSuedData}}</p>
          </el-form-item>
          <el-form-item label="有效期截止日期：">
            <p>{{lookForm.workerMan.idCardValidata}}</p>
          </el-form-item>
          <el-form-item label="工友联系方式：">
            <p>{{lookForm.workerMan.tel}}</p>
          </el-form-item>
          <el-form-item label="工类工种：">
            <span v-if="lookForm.workClass.name">{{lookForm.workClass.name}}</span>
            <span v-if="lookForm.workType.name">{{lookForm.workType.name}}</span>
          </el-form-item>
          <el-form-item label="紧急联系方式：">
            <p>{{lookForm.workerMan.emergencyContactTel}}</p>
          </el-form-item>
          <el-form-item label="血型：">
            <p>{{lookForm.workerMan.bloody}}</p>
          </el-form-item>
          <el-form-item label="班组：">
            <p>{{lookForm.workerTeam.name}}</p>
          </el-form-item>
          <el-form-item label="工资卡账号：">
            <p>{{lookForm.workerMan.bankAccount}}</p>
          </el-form-item>
          <el-form-item label="开户行地址：">
            <p>{{lookForm.workerMan.openAccountBank}}</p>
          </el-form-item>
        </div>
        <div style="width:50%;position:relative;float: left;">
          <el-form-item label="人脸：" style="">
            <img  style="width: 3rem;" v-if="lookForm.workerMan.headPhotoId"
                  :src="`/workerman/fileupload/pageShowFile?fid=${lookForm.workerMan.headPhotoId}`" alt="">
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="lookCancelBtn">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        查看管理员人员信息
    -->
    <el-dialog width="60%" title="管理人员信息详情" :visible.sync="proMessageVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :before-close="cancelSeePro">
      <el-form :model="proMessageForm" label-width="1.1rem" style="overflow: hidden;" ref="editForm">
        <div style="width:50%;position:relative;float: left;">
          <img v-if="proMessageForm.idCardPhotoId" style="position:  absolute;width: 1.15rem; right: -.5rem; top: -.03rem;"
               :src="`/workerman/fileupload/pageShowFile?fid=${proMessageForm.idCardPhotoId}`"/>
          <img v-else="proMessageForm.idCardPhotoId" style="position:  absolute; right:.1rem; top: .1rem;"
               src="../../../static/img/img.jpg"/>
          <el-form-item label="姓名：" style="width: 65%;">
            <p>{{proMessageForm.name}}</p>
          </el-form-item>
          <el-form-item label="性别：" style="width: 65%;">
            <p>{{proMessageForm.sex ? '男' : '女'}}</p>
          </el-form-item>
          <el-form-item label="民族：" style="width: 65%;">
            <p>{{proMessageForm.nation}}</p>
          </el-form-item>
          <el-form-item label="岗位：">
            <p>{{proMessageForm.job ? proMessageForm.job.name : ''}}</p>
          </el-form-item>
          <el-form-item label="住址：">
            <p>{{proMessageForm.address}}</p>
          </el-form-item>
          <el-form-item label="身份证号：">
            <p>{{proMessageForm.idCardNo}}</p>
          </el-form-item>
          <el-form-item label="联系电话：">
            <p>{{proMessageForm.tel}}</p>
          </el-form-item>
        </div>
        <div style="width:50%;position:relative;float: left;">
          <el-form-item label="人脸：" style="">
            <img style="width:3rem ;" :src="`/workerman/fileupload/pageShowFile?fid=${proMessageForm.headPhotoId}`" alt="">
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="cancelSeePro">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    queryList,
    findManByProjectIdAndKey,
    getManInfoByProject
  } from '../../api/projectapi'
  import {fuzzyQueryByName, getProInMessage, getShowLogs} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      },
      states: {
        type: Number
      }
    },
    data() {
      return {
        tokenId: '',
        tokenStr: '',
        proMessageForm: {},

        lookForm: {
          name: '',
          sex: '',
          idCardNo: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardOrg: '',
          isSuedData: '',
          idCardValidata: '',
          idCardPhotoId: '',
          tel: '',
          workClassId: '',
          workTypeId: '',
          emergencyContactTel: '',
          bloody: '',
          workerTeamId: '',
          bankAccount: '',
          openAccountBank: ''
        },

        lookCencelVisible: false,
        proMessageVisible: false,
        logsVisible: false,
        logsLoading: true,
        logsData: [],

        photoVisible: false,
        photoId: '',
        typeOption: [
          {
            id: '',
            name: '全部'
          },
          {
            id: '1',
            name: '工友'
          },
          {
            id: '2',
            name: '管理人员'
          }
        ],
        passOption: [
          {
            id: '',
            name: '全部'
          },
          {
            id: '0',
            name: '不放行'
          },
          {
            id: '1',
            name: '放行'
          }
        ],
        inOutOption: [
          {
            id: '',
            name: '全部'
          },
          {
            id: 'in',
            name: '进'
          },
          {
            id: 'out',
            name: '出'
          }
        ],
        queryForm: {
          pageSize: 10,
          pageNo: 1,
          projectId: this.formProject.id,
          'search.type': '',
          beginDt: '',
          endDt: '',
          'search.name':'',
          'search.validPass': ''
        },
        time: [],
        workerTeamOptionloading: false,
        workerManOption: [],
        tableData: [],
        loading: false,
        currentPage: 1,
        pagesize: 10,
        total: 0,
        workerloadingText: '姓名、手机号、身份证号',

        projectLoadingText: '姓名、岗位',
        projectTeamOptionloading: false,
        projectManOption: []
      }
    },
    created() {
      this.getList();
      this.tokenId = window.sessionStorage.getItem('tokenId');
      this.tokenStr = window.sessionStorage.getItem('tokenStr');
    },
    methods: {
      // 关闭
      cancelSeePro() {
        this.proMessageForm = {};
        this.proMessageVisible = false;
      },

      // 查看人详情
      lookThis(row) {
        if (row.roleName == '工友') {
          var parmas = {
            workerManId: row.workerManId,
            projectId: row.projectId,
            type: 'type'
          }
          this.lookCencelVisible = true;
          getManInfoByProject(parmas).then((res) => {
            if (res.data.code == 0) {
              this.lookForm = res.data.data;
              if (this.lookForm.workerMan.sex == 1) {
                this.lookForm.workerMan.sex = '男'
              }
              if (this.lookForm.workerMan.sex == 0) {
                this.lookFormlookForm.workerMan.sex = '女'
              }
              if (this.lookForm.workerMan.bloody == 'A') {
                this.lookForm.workerMan.bloody = 'A型'
              }
              if (this.lookForm.workerMan.bloody == 'B') {
                this.lookForm.workerMan.bloody = 'B型'
              }
              if (this.lookForm.workerMan.bloody == 'AB') {
                this.lookForm.workerMan.bloody = 'AB型'
              }
              if (this.lookForm.workerMan.bloody == 'O') {
                this.lookForm.workerMan.bloody = 'O型'
              }
              if (this.lookForm.workerMan.bloody == 'other') {
                this.lookForm.workerMan.bloody = '其他'
              }
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '获取工友详情失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        } else {
          let parmas = {
            personId: row.specialPersonId
          };
          getProInMessage(parmas).then((res) => {
            if (res.data.code == 0) {
              this.proMessageForm = res.data.data;
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '获取信息失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          });
          this.proMessageVisible = true;
        }

      },
      lookCancelBtn() {
        this.lookCencelVisible = false;
        this.$refs['editForm'].resetFields();
        this.lookForm.imgBase = '';
        this.lookForm.idCardPhotoPath = '';
        this.lookForm.workClassId = '';
        this.lookForm = {
          name: '',
          sex: '',
          idCardNo: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardOrg: '',
          isSuedData: '',
          idCardValidata: '',
          idCardPhotoId: '',
          tel: '',
          workClassId: '',
          workTypeId: '',
          emergencyContactTel: '',
          bloody: '',
          workerTeamId: '',
          bankAccount: '',
          openAccountBank: ''
        }
      },

      // 查看设备日志
      showLogs(id) {
        let parmas = {
          'equipmentId': id
        }
        getShowLogs(parmas).then((res) => {
          if (res.data.code == 0) {
            this.logsData = res.data.data.data;
            this.logsLoading = false;
            this.logsVisible = true;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 日志下载
      logsDownload(row) {
        window.open('/workerman/equipment/downloadLog?equipmentLogId=' + row.id, '日志下载');
      },

      toFalse() {
        this.workerloadingText = '姓名、手机号、身份证号';
      },
      seePhoto(val) {
        this.photoId = val;
        this.photoVisible = true;
      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.getList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.getList();
      },
      // removeReadOnly(e) {
      //   e.target.readOnly = false;
      // },
      reset() {
        // this.queryForm['search.specialPersonId'] = '';
        // this.queryForm['search.inOutType'] = '';
        this.queryForm['search.name'] = '';
        this.queryForm['search.type'] = '';
        // this.queryForm['search.workerManId'] = '';
        this.queryForm['search.validPass'] = '';
        this.queryForm.beginDt = '';
        this.queryForm.endDt = '';
        this.queryForm.pageNo = 1;
        this.queryForm.pageSize = 10;
        this.time = [];
        this.workerManOption = [];
      },
      getList() {
        this.loading = true;
        if (this.time != null) {
          this.queryForm.beginDt = this.time[0];
          this.queryForm.endDt = this.time[1];
        } else {
          this.queryForm.beginDt = '';
          this.queryForm.endDt = '';
        }
        queryList(this.queryForm).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.tableData = res.data.data.list;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].type == 'in') {
                this.tableData[i].type = '进'
              }
              if (this.tableData[i].type == 'out') {
                this.tableData[i].type = '出'
              }
              if (this.tableData[i].isPass) {
                this.tableData[i].isPass = '是'
              } else {
                this.tableData[i].isPass = '否'
              }
            }

            this.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //远程搜索工友
      getWorkManList(query) {
        this.workerTeamOptionloading = true;
        if (query == '') {
          this.workerManOption = [];
          this.workerloadingText = '姓名、手机号、身份证号';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            this.workerManOption = [];
            this.workerloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            this.workerManOption = [];
            this.workerloadingText = '请最少输入5位';
            return;
          }
        }
        if (query !== '') {
          this.workerTeamOptionloading = true;
          var data = {
            projectId: this.formProject.id,
            'search.key': query
          }
          findManByProjectIdAndKey(data).then((res) => {
            if (res.data.code == 0) {
              this.workerTeamOptionloading = false;
              this.workerManOption = res.data.data;
            } else {
              this.workerTeamOptionloading = false;
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }
      },

      // 管理员
      getProjectManList(query) {
        this.projectTeamOptionloading = true;
        if (query == '') {
          this.projectManOption = [];
          this.projectLoadingText = '姓名';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          this.projectTeamOptionloading = true;
          var data = {
            projectId: this.formProject.id,
            'search.name': query
          }
          fuzzyQueryByName(data).then((res) => {
            if (res.data.code == 0) {
              this.projectTeamOptionloading = false;
              this.projectManOption = res.data.data;
            } else {
              this.projectTeamOptionloading = false;
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        } else {
          this.projectManOption = [];
          this.projectLoadingText = '请输入汉字';
        }
      },
      //进出方式变化
      typeChange(val) {
        this.queryForm['search.specialPersonId'] = '';
        this.queryForm['search.workerManId'] = '';
      }
    }
  }
</script>
<style scoped>
  .inoutbox {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 12px;
    color: #606266;
  }

  .activeClick {
    color: #409EFF;
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
  }
</style>
<style>
  .inoutbox .el-form-item {
    margin-bottom: 0 !important;
  }

  .inoutbox .cell {
    height: auto !important;
    line-height: normal !important;
  }

  #photoSee .el-dialog {
    width: 400px;
  }
  .el-range-editor--small .el-range__icon {
    line-height: .24rem;
  }
  .el-range-editor--small.el-input__inner {
    height: .32rem;
  }
  .el-date-editor .el-range__icon {
    font-size: .14rem;
    margin-left: -.05rem;
  }
  .el-range-editor--small .el-range-input {
    font-size:.13rem ;
  }
  .el-range-editor--small .el-range-separator {
    line-height: .24rem;
    font-size: .13rem;
  }
  .el-date-table {
    font-size:.12rem ;
  }
  .el-date-range-picker__header div {
    font-size: .16rem;
    margin-right: .5rem;
  }
  .el-picker-panel__icon-btn {
    font-size: .12rem;
    color: #303133;
    border: 0;
    background: 0 0;
    cursor: pointer;
    outline: 0;
    margin-top: .08rem
  }
  .el-form--inline .el-form-item__content {
    vertical-align: middle;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 4rem;
  }
  .el-table .cell.el-tooltip {
    white-space: normal;
  }
  .inoutbox .el-input__inner{
    height: .32rem;
    line-height: .32rem;
    font-size: .14rem;
  }
</style>
