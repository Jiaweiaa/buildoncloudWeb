<template>
  <div class="access">
    <el-dialog :before-close="resetForm" :close-on-click-modal="false" :close-on-press-escape="false" title="设备进场"
               width="4.2rem" :visible.sync="adddVisible">
      <div style="max-width: 4rem;overflow: hidden;">
        <div>
          <p style="float: left; height:.32rem; line-height: .32rem;">设备唯一标识：</p>
          <el-input size="small" style="width: 1.6rem;" placeholder="输入设备唯一标识" :disabled="isDis"
                    v-model="formAdd.uniqueIdentity"></el-input>
          <el-button size="small" style="float: right;" type="primary" @click="queryAcc">查询设备</el-button>
        </div>
        <div v-if="divShow">
          <div style="margin: 10px 0;">
            <p style="float: left; height:32px; line-height: 32px;">生产厂家：</p>
            <p style="line-height: 34px;">{{formAdd.manufacturerName}}</p>
          </div>
          <div style="margin: 10px 0;">
            <p style="float: left; height:32px; line-height: 32px;">设备类型：</p>
            <p style="line-height: 34px;">{{formAdd.equipmentModelType}}</p>
          </div>
          <div style="margin: 10px 0;">
            <p style="float: left; height:32px; line-height: 32px;">设备型号：</p>
            <p style="line-height: 34px;">{{formAdd.equipmentModelName}}</p>
          </div>
          <div style="margin: 10px 0;" v-if="formAdd.equipmentModelType=='门禁'">
            <p style="float: left; height:32px; line-height: 32px;">是否为考勤设备：</p>
            <el-radio-group style="padding-top: 10px;" size="small" v-model="formAdd.businessType">
              <el-radio class="radio" label="0">是</el-radio>
              <el-radio class="radio" label="1">否</el-radio>
            </el-radio-group>
          </div>
          <div style="margin: 10px 0;" v-if="formAdd.equipmentModelType=='门禁'">
            <p style="float: left; height:32px; line-height: 32px;">设备进出类型：</p>
            <el-radio-group style="padding-top: 10px;" size="small" v-model="formAdd.doorAccessInOutFlag">
              <el-radio class="radio" label="in">进</el-radio>
              <el-radio class="radio" label="out">出</el-radio>
            </el-radio-group>
          </div>
          <div style="margin: 10px 0;">
            <p style="float: left; height:32px; line-height: 32px;">备注：</p>
            <el-input size="small" class="textareaOverflow" style="width: 90%;" :autosize="true" resize="none"
                      type="textarea" v-model="formAdd.note" :rows='3' auto-complete="off"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" v-if="divShow" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" v-if="divShow" @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" size="small" v-if="states!=2" @click="add">设备进场</el-button>
    <div class="demo-input-suffix" style="font-size: 12px;padding-top: 10px;position: relative;padding-bottom: 10px;">
      设备唯一标识：
      <el-input
        placeholder="设备唯一标识"
        style="width: 200px;"
        size="small"
        :maxlength="20"
        v-model="uniqueIdentity">
        <!--@change="equipmentListByProjectId"-->
      </el-input>
      <el-button style="position: absolute;right: 110px;top: 5px;" size="small" @click="reset" icon="el-icon-refresh">
        重置
      </el-button>
      <el-button style="position: absolute;right: 10px;top: 5px;" size="small" type="primary" icon="el-icon-search"
                 @click="equipmentListByProjectId">搜索
      </el-button>
    </div>
    <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" label="设备唯一标识" align="center">
        <template scope="scope">
          <p>{{ scope.row.uniqueIdentity}}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="设备型号" align="center">
        <template scope="scope">
          <p>{{ scope.row.equipmentModelName}}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="设备类型" align="center">
        <template scope="scope">
          <p>{{ scope.row.equipmentModelType}}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否是考勤设备" align="center">
        <template scope="scope">
          <p v-show="scope.row.equipmentModelType == '门禁'">{{ scope.row.businessType == '0' ? '是' : '否'}}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="设备进出类型" align="center">
        <template scope="scope">
          <p v-show="scope.row.doorAccessInOutFlag !==''">{{ scope.row.doorAccessInOutFlag == 'in' ? '进': '出'}}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否在线" align="center">
        <template scope="scope">
          <i style="font-size: 17px;color: red;" v-show="scope.row.isOnline == false" class="el-icon-circle-close"></i>
          <i style="font-size: 17px;color: green;" v-show="scope.row.isOnline == true" class="el-icon-circle-check"></i>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="当前固件版本" align="center">
        <template scope="scope">
          <p v-show="scope.row.doorAccessInOutFlag !==''">{{ scope.row.currentVersion }}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="备注" align="center">
        <template scope="scope">
          <p>{{ scope.row.note !== '' ? scope.row.note : ''}}</p>
        </template>
      </el-table-column>
      <el-table-column v-if="states!=2" label="操作" align="center" width="180">
        <template scope="scope">
          <el-button size="small" type="text" style="color:red;" @click="handleDelete(scope.row)">移除</el-button>
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
</template>
<script>
  import {
    equipmentModeList,
    equipmentBindProject,
    equipmentListByProjectId,
    equipmentUnBindProject,
    isExistsByUniqueIdentity,
    equipmentByUniqueIdentity
  } from '../../api/projectapi';

  import {
    getUserCompany
  } from '../../api/api';

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
      var checkuniqueIdentity = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('设备唯一标识不能为空'));
        } else {
          return callback();
//                    var data={
//                        uniqueIdentity:value,
//                        projectId:this.formProject.id
//                    }
//                    equipmentByUniqueIdentity(data).then((res) => {
//                        if(res.data.code==0){
//                            if(res.data.data==null){
//                                this.divShow=false;
//                                this.formAdd.equipmentId='';
//                                this.formAdd.manufacturerName='';
//                                this.formAdd.equipmentModelType='';
//                                this.formAdd.equipmentModelName='';
//                                this.formAdd.businessType='0';
//                                return callback(new Error('设备唯一标识不存在'));
//                            }else{
//                                var json=res.data.data;
//                                if(json.equipmentModelType=='0'){
//                                    json.equipmentModelType='门禁'
//                                }
//                                if(json.equipmentModelType=='1'){
//                                    json.equipmentModelType='LED大屏幕'
//                                }
//                                this.formAdd.equipmentId=json.equipmentId;
//                                this.formAdd.manufacturerName=json.manufacturerName;
//                                this.formAdd.equipmentModelType=json.equipmentModelType;
//                                this.formAdd.equipmentModelName=json.equipmentModelName;
//                                this.divShow=true;
//                                return callback();
//                            }
//                        }else if(res.data.code==1){
//                            this.divShow=false;
//                            this.formAdd.equipmentId='';
//                            this.formAdd.manufacturerName='';
//                            this.formAdd.equipmentModelType='';
//                            this.formAdd.equipmentModelName='';
//                            this.formAdd.businessType='0';
//                            callback(new Error(res.data.msg));
//                        }else if(res.data.code==-99){
//                            this.$router.push('/login');
//                            this.$notify.error({
//                                title: '您还未登录，请登录后重试',
//                                message: res.data.msg,
//                                offset: 100
//                            });
//                            return;
//                        }else {
//                            this.$notify.error({
//                                title: '获取门禁列表失败',
//                                message: res.data.msg,
//                                offset: 100
//                            });
//                            return;
//                        }
//                    })
          // var data={
          //     uniqueIdentity:value
          // }
          // isExistsByUniqueIdentity(data).then((res) => {
          //     if(res.data.code==0){
          //         callback();
          //     }else{
          //         callback(new Error(res.data.msg));
          //     }
          // })
        }
      };
      return {
        isDis: false,

        divShow: false,
        adddVisible: false,
        unitName: '',
        formAdd: {
          inProjectIds: '',
          equipmentId: '',
          uniqueIdentity: '',
          manufacturerName: '',
          equipmentModelType: '',
          equipmentModelName: '',
          businessType: '0',
          doorAccessInOutFlag: 'in',
          note: ''
        },
        rulesAdd: {
          uniqueIdentity: [
            {required: true, validator: checkuniqueIdentity, trigger: 'blur'}
          ],
          businessType: [
            {required: true, message: '请选择是否为考勤设备', trigger: 'blur'}
          ],
          doorAccessInOutFlag: [
            {required: true, message: '请选择设备进出类型', trigger: 'blur'}
          ]
        },
        //公司类别option
        workerList: [],
        //设备型号option
        equipmentModeOption: [],
        equipmentModeOptionOld: [],
        //列表
        loading: false,
        tableData: [],
        pagesize: 10,
        pageNo: 1,
        total: 1,
        currentPage: 1,
        uniqueIdentity: ''
      }
    },
    mounted() {
      this.$nextTick(function () {
        // 获取公司 项目
        this.unitName = this.formProject.unit.name;
        this.formAdd.inProjectIds = this.formProject.id;
      })
      //获取门禁列表
      this.equipmentListByProjectId();
    },
    methods: {
      reset() {
        this.formAdd.uniqueIdentity = '';
      },
      queryAcc() {
        if (this.formAdd.uniqueIdentity == '') {
          this.$notify.error({
            title: '设备唯一标识不能为空.',
            offset: 100
          });
        } else {
          var data = {
            uniqueIdentity: this.formAdd.uniqueIdentity,
            projectId: this.formProject.id
          }
          equipmentByUniqueIdentity(data).then((res) => {
            if (res.data.code == 0) {
              if (res.data.data == null) {
                this.$notify.error({
                  title: '输入的唯一标识不存在',
                  message: res.data.msg,
                  offset: 100
                });
                this.divShow = false;
                this.formAdd.equipmentId = '';
                this.formAdd.manufacturerName = '';
                this.formAdd.equipmentModelType = '';
                this.formAdd.equipmentModelName = '';
                this.formAdd.businessType = '0';
              } else {
                var json = res.data.data;
                if (json.equipmentModelType == '0') {
                  json.equipmentModelType = '门禁'
                }
                if (json.equipmentModelType == '1') {
                  json.equipmentModelType = 'LED大屏幕'
                }
                this.isDis = true;
                this.formAdd.equipmentId = json.equipmentId;
                this.formAdd.manufacturerName = json.manufacturerName;
                this.formAdd.equipmentModelType = json.equipmentModelType;
                this.formAdd.equipmentModelName = json.equipmentModelName;
                this.divShow = true;
              }
            } else {
              this.$notify.error({
                title: '获取门禁列表失败',
                message: res.data.msg,
                offset: 100
              });
            }
          })
        }
      },
      //每页条数改变
      handleSizeChange(val) {
        this.pagesize = val;
        this.equipmentListByProjectId();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.equipmentListByProjectId();
      },
      add() {
        this.divShow = false;
        this.formAdd.equipmentId = '';
        this.formAdd.manufacturerName = '';
        this.formAdd.equipmentModelType = '';
        this.formAdd.equipmentModelName = '';
        this.formAdd.businessType = '0';
        this.adddVisible = true;

      },
      //获取门禁列表
      equipmentListByProjectId() {
        this.loading = true;
        var data = {
          pageNo: this.pageNo,
          pageSize: this.pagesize,
          projectId: this.formProject.id,
          'search.uniqueIdentity': this.uniqueIdentity
        }
        equipmentListByProjectId(data).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.tableData = res.data.data.list;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].equipmentModelType == '0') {
                this.tableData[i].equipmentModelType = '门禁'
              }
              if (this.tableData[i].equipmentModelType == '1') {
                this.tableData[i].equipmentModelType = 'LED大屏幕'
              }
            }
            this.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
            this.$notify.error({
              title: '获取门禁列表失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //确定
      submitForm() {
        this.adddVisible = false;
        if (this.formAdd.equipmentModelType !== '门禁') {
          this.formAdd.businessType = '';
          this.formAdd.doorAccessInOutFlag = '';
        }
        var data = {
          equipmentId: this.formAdd.equipmentId,
          projectId: this.formAdd.inProjectIds,
          businessType: this.formAdd.businessType,
          doorAccessInOutFlag: this.formAdd.doorAccessInOutFlag,
          note: this.formAdd.note
        };
        var self = this;
        equipmentBindProject(data).then((res) => {
          if (res.data.code == 0) {
            // self.$message({
            //     type: 'success',
            //     message: '添加成功!'
            // });
            self.$notify.success({
              title: '添加!',
              message: '操作成功',
              offset: 100
            });
            self.isDis = false;
            self.formAdd.equipmentId = '';
            self.formAdd.uniqueIdentity = '';
            self.formAdd.manufacturerName = '';
            self.formAdd.equipmentModelType = '';
            self.formAdd.equipmentModelName = '';
            self.formAdd.businessType = '0';
            self.formAdd.doorAccessInOutFlag = 'in';
            self.formAdd.note = '';
            self.equipmentListByProjectId();
          } else {
            this.$notify.error({
              title: '添加失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //取消
      resetForm() {
        this.divShow = false;
        this.formAdd.equipmentId = '';
        this.formAdd.uniqueIdentity = '';
        this.formAdd.manufacturerName = '';
        this.formAdd.equipmentModelType = '';
        this.formAdd.equipmentModelName = '';
        this.formAdd.doorAccessInOutFlag = 'in';
        this.formAdd.note = '';
        this.formAdd.businessType = '0';
        this.adddVisible = false;
        this.isDis = false;
      },
      //删除设备
      handleDelete(item) {
        var self = this;
        this.$confirm('确定移除该设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {
            projectId: item.projectId,
            equipmentId: item.equipmentId
          }
          equipmentUnBindProject(data).then((res) => {
            if (res.data.code == 0) {
              // self.$message({
              //     type: 'success',
              //     message: '移除成功!'
              // });
              this.$notify.success({
                title: '移除!',
                message: '移除成功',
                offset: 100
              });
              self.equipmentListByProjectId();
            } else {
              this.$notify.error({
                title: '移除失败',
                message: res.data.msg,
                offset: 100
              });
            }
          })
        }).catch(() => {

        });
      },
    },
  }
</script>
<style scoped>
  .access {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 0rem;
  }
</style>
<style>
  .access .el-form-item__label {
    line-height: 34px;
  }
</style>
