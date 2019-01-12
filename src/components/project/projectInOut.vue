<template>
  <div id="projectInOut">
    <!--
        新增按钮
    -->
    <el-button size="small" type="primary" style="margin: .2rem;" @click="clickAdd">工程人员进场</el-button>

    <!--
        新增弹层
    -->
    <el-dialog :close-on-press-escape="false" title="创建工程人员信息" :visible.sync="addVisible" :before-close="addCencel"
               :close-on-click-modal="false">
      <div style="width: 3rem; height: .6rem; position: relative; left: 50%; margin-left:-100px; margin-bottom: .2rem;">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="录取身份信息"></el-step>
          <el-step title="录取其他信息"></el-step>
        </el-steps>
      </div>
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" style="overflow: hidden;" ref="addForm"
               v-show="active == 0">
        <el-form-item label="姓名" prop="name" style="width: 65%;">
          <el-input size="small" placeholder="请输入姓名" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <img style="position:  absolute; right:.6rem; top: 1.5rem;" :src="addForm.imgBase"/>
        <el-form-item label="性别" prop="sex" style="width: 65%;">
          <el-select size="small" style="height: .4rem !important; width: 100%;" v-model="addForm.sex"
                     placeholder="请选择性别">
            <el-option
              v-for="item in sexArrAdd"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="nation" style="width: 65%;">
          <el-input size="small" placeholder="请输入民族" v-model="addForm.nation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="jobId">
          <el-select size="small" style="height: .4rem !important; width: 100%;" v-model="addForm.jobId"
                     placeholder="请选择岗位">
            <el-option
              v-for="item in projcetManList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNo">
          <el-input size="small" placeholder="请输入身份证号" v-model="addForm.idCardNo"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input size="small" placeholder="请输入联系电话" v-model="addForm.tel"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="住址" prop="address">
          <el-input size="small" placeholder="请输入住址" v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-popover trigger="hover" placement="top"
                    style="text-align: center; display: block; width: .3rem; float: right;  margin-top: .05rem; margin-right: .1rem; cursor: pointer;">
          <p>身份证读卡器使用说明：</p>
          <p>1: 安装驱动：安装驱动文件ZKIDROnline.exe，安装后需要重启计算机。</p>
          <p>2: 接入设备：重启后，将读卡器插入USB口，读卡器发出两声蜂鸣。</p>
          <p>3: 读取信息：点击『读取身份证信息』按钮，读取成功发出一声蜂鸣。</p>
          <p>注: 如果仍有问题，请联系系统管理人员。</p>
          <p @click="guidePath(false)"
             style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">点击进入读卡器操作过程</p>
          <p @click="downloadFile"
             style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">下载驱动和证书</p>
          <div slot="reference" class="name-wrapper">
            <i class="el-icon-question"></i>
          </div>
        </el-popover>
        <div v-if="!getCardDataShow" style="display: inline-block;float: right;">身份证读卡器驱动未安装，或安装错误
          <p @click="downloadFile" style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">
            下载驱动和证书</p>
        </div>
        <el-button size="small" v-if="getCardDataShow" style="margin-bottom: .2rem; float: right;" :loading="cardBok" @click="getCardData">
          读取身份证信息
        </el-button>
      </el-form>
      <el-form style="overflow: hidden;" :model="addForm2" label-width="1.1rem" :rules="addFormRules2"
               ref="addForm2" v-show="active == 1">
        <el-form-item label="照片" prop="headPhotoPath">
          <img v-show="imgSrc==''" src="../../../static/img/face.jpg" alt="">
          <img v-show="imgSrc!=''" :src="imgSrc" alt="">
          <el-button size="small" style="margin-left: 20px;" @click="takephoto()">录入人脸</el-button>
          <el-button type="text" @click="guidePath(true)"></el-button>
        </el-form-item>
        <el-button size="small" style="margin-bottom: 20px; float: right;" @click="prevClick(1)">上一步</el-button>
      </el-form>

      <el-button size="medium" style="float: right; margin-bottom: 20px;" @click="next" v-show="active !== 1">
        下一步
      </el-button>
      <el-button size="medium" style="float: right; margin-bottom: 20px;" @click="addCencel" v-show="active == 1">
        取消
      </el-button>
      <el-button size="medium" style="float: right; margin-bottom: 20px; margin-right: 10px;" @click="add"
                 :loading="addLoading"
                 v-show="active == 1">保存
      </el-button>
    </el-dialog>

    <!--
        相机
    -->
    <el-dialog title="相机" :visible.sync="cameraVisible" width="30%" :close-on-click-modal="false"
               :close-on-press-escape="false" :before-close="closeCarmer" @open="cameraOpen">
      <div v-show="temporaryImg == ''" id="pushwebcam"
           style="position: relative; overflow: hidden;padding-bottom: .2rem;">
        <!--<img class="maskPhoto" src="../../../static/img/face.png" />-->
        <div id="my_camera" style="width:3.2rem; height:2.4rem;"></div>
        <el-button style="margin-top: 20px; float: right;" size="small" @click="paizao">拍照</el-button>
      </div>
      <div v-show="temporaryImg !== ''" class="demo-container" style="position: relative;margin-bottom: .2rem; ">
        <div style="vertical-align: top;position: relative;" class="demo-container">
          <div v-show="!isSureRecord" style="width: 3.2rem; height: 2.4rem; float: left;">
            <vueCropper
              ref="cropper"
              :img="example2.img"
              :autoCrop="example2.autoCrop"
              :autoCropWidth="example2.autoCropWidth"
              :autoCropHeight="example2.autoCropHeight"
            ></vueCropper>
          </div>
          <img class="recordImg" v-show="isSureRecord" :src="this.temporaryImg"/>
          <img v-show="addForm.imgBase !== '../../../static/img/img.jpg' && isSureRecord" class="idCardImg"
               :src="addForm.imgBase"/>
          <div v-show="showIsFace !== ''" style="width: 100%;margin-top: .2rem;text-align: center; font-size: .13rem;">
            <span style="color: red; vertical-align:middle; margin-right: 5px;">*</span>{{this.showIsFace}}
          </div>
        </div>
        <el-button style="float: right; margin-right: 10px; margin-top: 10px;" v-show="!isSureRecord" size="small"
                   @click="takePhotoHead">截取头像
        </el-button>
        <el-button v-show="isSureRecord" style="float: right; margin-right: 10px; margin-top: 10px; " size="small" :loading="recordLoading"
                   @click='surePhoto'>确定
        </el-button>
        <el-button style="float: right; margin-right: 10px; margin-top: 10px; margin-bottom: 10px;" size="small"
                   @click="cancelPhoto">取消
        </el-button>
      </div>
    </el-dialog>

    <!--
        操作框
    -->
    <div class="operation">
      <div class="btns">
        <el-button size="small" v-show="activeIndex == 0" type="primary" @click="enterField()">确认进场</el-button>
        <el-button size="small" v-show="activeArr.length > 0" type="danger" @click="del()">删除</el-button>
      </div>
      <!--<div class="tabs">-->
      <!--<div class="nth0" :class="{'activeBtn':activeIndex == 0}" @click="enterOrGoOut(0)">未进场</div>-->
      <!--<div class="nth1" :class="{'activeBtn':activeIndex == 1}" @click="enterOrGoOut(1)">已进场</div>-->
      <!--</div>-->
      <!--<div class="search">-->
      <!--<el-input size="small" placeholder="请输入工友姓名或者联系方式"  clearable v-model="searchVal" class="input-with-select">-->
      <!--<el-button size="small" slot="append" icon="el-icon-search" @click="search"></el-button>-->
      <!--</el-input>-->
      <!--</div>-->
    </div>

    <!--
        表单
    -->
    <div class="table">
      <el-table
        stripe
        border
        v-loading="loading"
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="姓名"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <p :class="{clickCss : activeIndex == 1 }" @click="seeProject(scope.row)">{{ scope.row.name ? scope.row.name
              : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="岗位"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <p>{{ scope.row.job ? scope.row.job.name : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <p>{{ scope.row.tel ? scope.row.tel : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="身份证号"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <p>{{ scope.row.idCardNo ? scope.row.idCardNo : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="进场日期"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <p>{{ scope.row.inDate ? scope.row.inDate : ''}}</p>
          </template>
        </el-table-column>
      </el-table>
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

    <!--
        查看工程人员人员信息
    -->
    <el-dialog width="60%" title="工程人员信息详情" :visible.sync="proMessageVisible" :close-on-click-modal="false"
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
            <img style="width: 3rem;" :src="`/workerman/fileupload/pageShowFile?fid=${proMessageForm.headPhotoId}`" alt="">
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
    getProjectJob,
    upFileDo,
    checkIdcard,
    getProjectList,
    addProjectIn,
    getProInMessage,
    faceToFace,
    delProject
  } from '../../api/api';
  import vueCropper from 'vue-cropper';
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      // 姓名
      var validName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('姓名不能带有空格！'));
        } else {
          callback()
        }
      };
      // 民族
      var validNation = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入民族！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('民族不能带有空格！'));
        } else {
          callback()
        }
      };
      // 住址
      var validAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入住址！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('住址不能带有空格！'));
        } else {
          callback()
        }
      };
      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入15位或者18位身份证号！'));
        } else {
          callback();
//                    var parmas = {
//                        'idCardNo': value
//                    }
//                    checkIdcard(parmas).then((res) => {
//                        if (res.data.code == 0) {
//                            this.addForm.birthDate = res.data.msg;
//                            callback();
//                        } else {
//                            callback(new Error(res.data.msg));
//                        }
//                    })
        }
      };
      // 校验手机号
      var validatePhone = (rule, value, callback) => {
        var reg = /^[1]\d{10}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入11位手机号！'));
        } else {
          callback();
        }
      };
      return {
        getCardDataShow:false,
        // 截图插件参数
        example2: {
          img: '',
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
        },
        isSureRecord: false,
        showIsFace: '',

        proMessageVisible: false,
        proMessageForm: {},

        // 加载
        addLoading: false,
        recordLoading: true,

        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,
        loading: true,

        listData: [],

        // 项目管理员列表
        projcetManList: [],

        // 新增
        addVisible: false,
        addForm: {
          name: '',
          sex: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardNo: '',
          idCardOrg: '',
          isSuedData: '',
          jobId: '',
          tel: '',
          idCardValidata: '',
          imgBase: '../../../static/img/img.jpg'
        },
        addFormRules: {
          name: [
            {required: true, validator: validName, trigger: 'blur'},
            {min: 1, max: 15, message: '姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          tel: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          nation: [
            {required: true, validator: validNation, trigger: 'blur'},
            {min: 1, max: 10, message: '民族最大长度不能超过10个字符', trigger: 'blur'}
          ],
          jobId: [
            {required: true, message: '请选择职务', trigger: 'change'}
          ],
          birthDate: [
            {required: true, message: '请选择出生日期', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请填写地址', trigger: 'change'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'},
            {min: 1, max: 18, message: '身份证号最大长度不能超过18个字符', trigger: 'blur'}
          ],
          idCardOrg: [
            {min: 1, max: 50, message: '签发机关最大长度不能超过50个字符', trigger: 'blur'}
          ]
        },
        active: 0,
        // 获取身份证开关
        cardBok: false,
        sexArrAdd: [{
          value: 1,
          label: '男'
        }, {
          value: 0,
          label: '女'
        }],
        pickerOptions1: {
          disabledDate: (time) => {
            const start = new Date();
            return time.getTime() > start.getTime();
          }
        },
        addForm2: {
          headPhotoPath: ''
        },
        addFormRules2: {
          headPhotoPath: [
            {required: true, message: '请拍取照片', trigger: 'change'}
          ]
        },
        imgSrc: '',

        cameraVisible: false,
        temporaryImg: '',

        // 状态active
        activeIndex: 1,

        // 班组查询的
        searchForm: {
          'pageSize': 10,
          'pageNo': 1,
          'search.projectId': '',
          'search.approvalStates': ''
        },

        // 选中数组
        activeArr: []

      }
    },
    created() {
      this.searchForm['search.projectId'] = this.formProject.id;
      this.getAllProject();
      this.getList();
      this.ifCard();
    },
    components: {
      vueCropper
    },
    methods: {
      //判断是否安装插件
      ifCard(){
        var _this=this;
        function createCORS(method, url) {
          var xhr = new XMLHttpRequest();
          if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
          } else if (typeof XDomainRequest != 'undefined') {
            var xhr = new XDomainRequest();
            xhr.open(method, url);
          } else {
            xhr = null;
          }
          return xhr;
        }

        var request = createCORS('get', 'http://127.0.0.1:24010/ZKIDROnline/info?' + Math.random());
        if (request) {
          try {
            request.onload = function () {
            };
            request.onreadystatechange = function () {
              if (request.readyState == 4) {
                if(request.status !== 200){
                  _this.getCardDataShow=false;
                }else{
                  _this.getCardDataShow=true;
                }
              }
            }
            request.send();
          }catch (e) {

          }
        }
      },
      guidePath(bool) {
        if (bool) {
          sessionStorage.setItem("nameCamera", "camera");
        } else {
          sessionStorage.removeItem("nameCamera");
        }
        window.open(window.location.origin + '/#/OperationsGuide')
      },
      // 截取头像
      takePhotoHead() {
        this.$refs.cropper.getCropData((data) => {
          this.temporaryImg = data;
          if (this.addVisible == true) {
            if (this.addForm.imgBase !== '../../../static/img/img.jpg') {
              var parmas = {
                'face1': this.temporaryImg.substring(23, this.temporaryImg.length),
                'face2': this.addForm.imgBase.substring(22, this.addForm.imgBase.length)
              }
              faceToFace(parmas).then((res) => {
                if (res.data.code == 0) {
                  this.showIsFace = '相似度为' + parseInt(res.data.data * 100) + '%,确认要提交吗?';
                  this.recordLoading = false;
                } else if (res.data.code == 80) {
                  this.showIsFace = res.data.msg;
                  this.recordLoading = true;
                }
                else {
                  this.showIsFace = '相似度为对比失败:' + res.data.msg;
                  this.recordLoading = true;
                }
              })
            } else {
              var parmas = {
                'face1': this.temporaryImg.substring(23, this.temporaryImg.length),
                'face2': ''
              }
              faceToFace(parmas).then((res) => {

                if (res.data.code == 0) {
                  this.recordLoading = false;
                  console.log(1)
                } else if (res.data.code == 80) {
                  this.showIsFace = res.data.msg;
                  this.recordLoading = true;
                }
                else {
                  this.showIsFace = '相似度为对比失败:' + res.data.msg;
                  this.recordLoading = true;
                }
              })
            }
            this.isSureRecord = true;

          } else {
            var parmas = {
              'face1': this.recordUrl.substring(23, this.recordUrl.length),
              'face2': this.addForm.imgBase.substring(22, this.addForm.imgBase.length),
            }
            faceToFace(parmas).then((res) => {
              if (res.data.code == 0) {
                this.showIsFace = '相似度为' + parseInt(res.data.data * 100) + '%,确认要提交吗?';
                this.recordLoading = false;
              } else if (res.data.code == 80) {
                this.showIsFace = res.data.msg;
                this.recordLoading = true;
              }
              else {
                this.showIsFace = '相似度为对比失败:' + res.data.msg;
                this.recordLoading = true;
              }
              this.isSureRecord = false;
            })
          }
        });
      },

      // 查看管理员人员
      seeProject(row) {
        if (this.activeIndex == 1) {
          let parmas = {
            personId: row.id
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
        } else {
          return;
        }
      },
      // 关闭
      cancelSeePro() {
        this.proMessageForm = {};
        this.proMessageVisible = false;
      },
      // 获取列表
      getList() {
        this.searchForm['search.approvalStates'] = this.activeIndex;
        getProjectList(this.searchForm).then((res) => {
          this.loading = false;
          this.listData = res.data.data.list;
          this.total = res.data.data.totalCount;
        });
      },

      // 获取所有职务
      getAllProject() {
        getProjectJob().then((res) => {
          this.projcetManList = res.data.data;
        })
      },

      // 照相
      takephoto() {
        this.cameraVisible = true;
      },
      // 下载附件
      downloadFile() {
        window.open('../../../static/身份证读卡器驱动和证书.zip', '下载附件')
      },
      // 点击新增
      clickAdd() {
        this.addVisible = true;
      },
      // 取消新增
      addCencel() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
        this.$refs['addForm2'].resetFields();
        this.addForm.imgBase = '../../../static/img/img.jpg';
        this.addForm2.workClassId = '';
        this.addForm.idCardPhotoPath = '';
        this.active = 0;
        this.addForm.birthDate = '';
        this.imgSrc = '';
        Webcam.reset();
      },
      // 下一步
      next() {
        if (this.active == 0) {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              var reg = /^[\u2E80-\u9FFF]+$/;
              if (!reg.test(this.addForm.nation)) {
                // this.$message({
                //     type: 'warning',
                //     message: '请输入正确的民族!'
                // });
                this.$notify.warning({
                  title: '民族',
                  message: '请输入正确的民族',
                  offset: 100
                });
                return;
              }
              this.active = 1;
            }
          });
        }
      },
      // 上一步
      prevClick(val) {
        this.active = val - 1;
      },
      // 读卡器
      getCardData() {
        var _this = this;
        _this.cardBok = true;

        function createCORS(method, url) {
          var xhr = new XMLHttpRequest();
          if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
          } else if (typeof XDomainRequest != 'undefined') {
            var xhr = new XDomainRequest();
            xhr.open(method, url);
          } else {
            xhr = null;
          }
          return xhr;
        }

        // var request = createCORS('get', 'https://127.0.0.1:24011/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + Math.random());
        var request = createCORS('get', 'http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + Math.random());
        if (request) {
          request.onload = function () {
            _this.cardBok = false;
            var data = eval('(' + request.response + ')').Certificate;
            if (data) {
              _this.addForm.name = data.Name;
              var parmas = {
                imgStr: data.Base64Photo
              }
              upFileDo(parmas).then((res) => {
                _this.addForm.idCardPhotoPath = res.data.data;
              })
              if (data.Sex === '男') {
                _this.addForm.sex = 1;
              } else if (data.Sex === '女') {
                _this.addForm.sex = 0;
              }
              _this.addForm.nation = data.Nation;
              _this.addForm.birthDate = data.Birthday;
              _this.addForm.address = data.Address;
              _this.addForm.idCardNo = data.IDNumber;
              _this.addForm.idCardOrg = data.IDIssued;
              _this.addForm.isSuedData = data.IssuedData;
              if (data.ValidDate == '长期') {
                _this.addForm.idCardValidata = '2099-12-31'
              } else {
                _this.addForm.idCardValidata = data.ValidDate;
              }
              _this.addForm.imgBase = 'data:image/jpg;base64,' + data.Base64Photo;
            } else {
              _this.$notify.error({
                title: '读取信息失败',
                message: '请查看读卡器是否链接，或联系管理员',
                offset: 100
              });
            }
          }
          request.send();
        } else {
          this.cardBok = false;
          this.$notify.error({
            title: '读取信息失败',
            message: '请查看读卡器是否链接，或联系管理员',
            offset: 100
          });
        }
        ;
      },
      add() {
        this.$refs.addForm2.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({
              'headPhotoPath': this.addForm2.headPhotoPath,
              'projectId': this.formProject.id
            }, this.addForm)
            this.addLoading = true;
            addProjectIn(parmas).then((res) => {
              if (res.data.code == 0) {
                this.getList();
                this.addCencel();
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '进场成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
              } else {
                myCallback.call(this,res)
                // this.$notify.error({
                //   title: '进场失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              };
              this.addLoading = false;
            })
          }
        })
      },

      // 相机
      cameraOpen() {
        this.temporaryImg = '';
        this.$nextTick(function () {
          Webcam.attach('#my_camera');
        })
      },
      surePhoto() {
        if (this.showIsFace.substring(4, 6) < 50 && this.showIsFace !== '') {
          this.$confirm(this.showIsFace, '相似度过低请确认是本人', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.sameDo();
          }).catch(() => {
          });
        } else {
          this.sameDo();
        }

      },
      // 公共函数
      sameDo() {
        this.imgSrc = this.temporaryImg;
        //获取头部id
        var parmas = {
          imgStr: this.imgSrc.substring(22)

        }
        upFileDo(parmas).then((res) => {
          this.addForm2.headPhotoPath = res.data.data;
        })

        this.cameraVisible = false;
        Webcam.reset();
        this.isSureRecord = false;
        this.showIsFace = '';
      },
      cancelPhoto() {
        this.temporaryImg = '';
        this.isSureRecord = false;
        this.showIsFace = '';
      },
      closeCarmer() {
        this.temporaryImg = '';
        this.isSureRecord = false;
        this.showIsFace = '';
        this.cameraVisible = false;
        Webcam.reset();
      },
      paizao() {
        var _this = this;
        Webcam.snap(function (data_uri) {
          _this.temporaryImg = data_uri;
          _this.example2.img = data_uri;
        });
      },

      // 进场
      enterOrGoOut(index) {
        this.activeIndex = index;
        this.searchForm['pageNo'] = 1;
        this.getList();
      },

      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.loading = true;
        this.getList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.searchForm.pageNo = val;
        this.loading = true;
        this.getList();
      },

      // 全选
      handleSelectionChange(val) {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
          arr.push(val[i].id);
        }
        this.activeArr = arr;
      },

      // 进场
      enterField() {
      },
      // 删除
      del() {
        this.$confirm('此操作将执行批量工程人员删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var parmas = {
            personId: this.activeArr
          }
          this.loading = true;
          delProject(parmas).then((res) => {
            if (res.data.code == 0) {
              this.$notify.success({
                title: '删除成功' + res.data.data.successNum + '人;' + '删除失败' + res.data.data.errorNum + '人',
                message: '',
                offset: 100
              });
              this.getList();
            } else {
              this.$notify.error({
                title: '删除失败',
                message: res.data.msg,
                offset: 100
              });
            }
            this.getList();
          })
        }).catch(() => {
        });
      }
    }
  }
</script>
<style scoped>
  #projectInOut {
    min-width: 1000px;
    border-top: 1px solid #eee;
    padding-top: 10px;
    font-size: 12px;
    color: #606266;
    position: relative;
  }

  #projectInOut .operation {
    position: relative;
    overflow: hidden;
    margin-top: .2rem;
    margin-left: .2rem;
    height: .4rem;
  }

  #projectInOut .operation .btns {
    width: 1.2rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  #projectInOut .operation .search {
    width: 300px;
    position: absolute;
    top: 0;
    right: 0;
  }

  #projectInOut .operation .tabs {
    width: 304px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 0;
    margin-left: -152px;
  }

  #projectInOut .operation .tabs div {
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    float: left;
    border: 1px solid #999;
    cursor: pointer;
  }

  #projectInOut .operation .tabs .nth0 {
    border-radius: 5px 0 0 5px;
  }

  #projectInOut .operation .tabs .nth1 {
    border-radius: 0 5px 5px 0;
  }

  #projectInOut .operation .tabs .activeBtn {
    background: #409EFF;
    color: #fff;
    border: 1px solid #409EFF;
  }

  #projectInOut .table {
    margin-top: 15px;
  }

  .clickCss {
    color: #409EFF;
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
  }

  #projectInOut .maskPhoto {
    width: 120px;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -100px;
  }
</style>
