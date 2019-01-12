<template>
  <div class="box">
    <!--创建通知-->
    <el-dialog id="add" :before-close="exitQX" top="50px" title="创建通知" :visible.sync="exitVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
        <el-form-item label="通知标题" prop="title">
          <el-input size="small" v-model="addForm.title" maxlength="50" placeholder="请输入通知标题"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否显示到电视" prop="showTV">
          <el-radio-group v-model="addForm.showTV" size="small">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="addForm.showTV == 1" label="显示开始时间：" prop="startTime">
          <el-date-picker
            size="small"
            v-model="addForm.startTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="addForm.showTV == 1" label="显示结束时间：" prop="endTime">
          <el-date-picker
            size="small"
            v-model="addForm.endTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input
            type="textarea"
            :rows="4"
            :maxlength="100"
            placeholder="请输入内容"
            v-model="addForm.content">
          </el-input>
        </el-form-item>
        <el-form-item label="对象：" prop="sender">
          <el-radio-group @change="senderChange" v-model="addForm.sender">
            <el-radio label="WTL">班组长</el-radio>
            <el-radio label="WM">工友</el-radio>
            <el-radio label="PA">项目管理人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班组列表：" prop="teamIds" v-show="addForm.sender == 'WTL'">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="addForm.teamIds" @change="handleCheckedDataChange">
            <el-checkbox v-for="teamName in WorkerTeamList" :label="teamName.id" :key="teamName.id">
              {{teamName.workteamname}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="工种：" prop="typeIds" v-show="addForm.sender == 'WM'">
          <el-checkbox :indeterminate="isTypeIndeterminate" v-model="typeCheckAll" @change="handleTypeCheckAllChange">
            全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="addForm.typeIds" @change="handleTypeCheckedDataChange">
            <el-checkbox v-for="type in WorkerTeamTypeList" :label="type.id" :key="type.id">{{type.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            :maxlength="100"
            placeholder="请输入内容"
            v-model="addForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="exitQX">取消</el-button>
        <el-button size="small" type="primary" @click.native="exitQD">发布</el-button>
      </div>
    </el-dialog>
    <!--查看通知-->
    <el-dialog id="cock" top="50px" title="项目通知详情" :visible.sync="lockVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form :model="lockForm" label-width="110px" ref="lockForm">
        <el-form-item label="通知标题:">
          <p>{{lockForm.title}}</p>
        </el-form-item>
        <el-form-item label="是否显示到电视:">
          <p>{{lockForm.showTV ? '显示' : '不显示'}}</p>
        </el-form-item>
        <el-form-item label="内容:">
          <p>{{lockForm.content ? lockForm.content : ''}}</p>
        </el-form-item>
        <el-form-item v-show="lockForm.showTV" label="显示开始时间：">
          <p>{{lockForm.startTime}}</p>
        </el-form-item>
        <el-form-item v-show="lockForm.showTV" label="显示结束时间：">
          <p>{{lockForm.endTime}}</p>
        </el-form-item>
        <el-form-item label="对象：">
          <p>{{lockForm.sender}}</p>
        </el-form-item>
        <el-form-item v-show="lockForm.sender == '工友'" label="工种：">
          <p>{{lockForm.senderData}}</p>
        </el-form-item>
        <el-form-item v-show="lockForm.sender == '班组长'" label="班组列表：">
          <p>{{lockForm.senderData}}</p>
        </el-form-item>
        <el-form-item label="备注:">
          <p>{{lockForm.remark}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="lockVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-button size="small" type="primary" v-if="states!=2" @click="add">创建通知</el-button>
    <div style="position: relative;" class="bottom10">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item label="通知标题：">
          <el-input :maxlength="10" v-model="queryForm.title" size="small" placeholder="请输入标题"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="创建日期：">
          <el-date-picker
            v-model="time"
            type="daterange"
            size="small"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyyMMdd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button style="position: absolute;right: 110px;top: 5px;" size="small" @click="reset" icon="el-icon-refresh">
          重置
        </el-button>
        <el-button style="position: absolute;right: 10px;top: 5px;" size="small" type="primary" icon="el-icon-search"
                   @click="createNoList">搜索
        </el-button>
      </el-form>
    </div>
    <!--列表-->
    <el-table el-table v-loading="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              style="width: 100%">
      <el-table-column
        label="标题" align="center">
        <template scope="scope">
          <p @click="lock(scope.row)" style="color:#409EFF;cursor: pointer;">{{ scope.row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template scope="scope">
          <p>{{ scope.row.opAt}}</p>
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
    workClass,
    createNotification,
    NoList,
    queryWorkerTeamListInProject
  } from '../../api/projectapi'
  import {
    getTypeByInProject,
    fetchDetails
  } from '../../api/api';
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
        exitVisible: false,
        typeOption: [
          {
            id: 0,
            name: '文本'
          },
          {
            id: 1,
            name: '图片'
          }
        ],
        typeOption2: [
          {
            id: '',
            name: '全部'
          },
          {
            id: 0,
            name: '文本'
          },
          {
            id: 1,
            name: '图片'
          }
        ],
        queryForm: {
          title: '',
          dateForm: '',
          projectId: this.formProject.id,
          dateTo: '',
          startTime: '',
          endTime: '',
          pageSize: 10,
          pageNo: 1
        },
        addForm: {
          showTV: 1,
          projectId: this.formProject.id,
          title: '',
          startTime: '',
          endTime: '',
          address: '',
          sender: 'WTL',
          remark: '',
          teamIds: [],
          typeIds: [],
          content: ''
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          startTime: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ],
          endTime: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ],
          showTV: [
            {required: true, message: '请输入地点', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
          sender: [
            {required: true, message: '请选择对象', trigger: 'blur'}
          ],
          teamIds: [
            {type: 'array', required: true, message: '请选择班组', trigger: 'blur'}
          ],
          typeIds: [
            {type: 'array', required: true, message: '请选择工类工种', trigger: 'blur'}
          ]

        },
        // 工类option
        workClassOption: [
          {
            id: '',
            name: '全部'
          }
        ],
        //工种option
        workTypeOption: [
          {
            id: '',
            name: '全部'
          }
        ],
        //图片
        imageUrl: '',
        targetOption: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 1,
            name: '班组长'
          },
          {
            id: 2,
            name: '工友'
          }
        ],
        time: [],
        tableData: [],
        loading: false,
        //查看通知
        lockVisible: false,
        lockForm: {},
        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,

        // 所有班组的数据
        WorkerTeamList: [],
        // 全选状态
        checkAll: false,
        // 应该全选的
        idOptions: [],
        isIndeterminate: true,

        // 所有工类工种的数据
        WorkerTeamTypeList: [],
        // 全选状态
        typeCheckAll: false,
        // 应该全选的
        idTypeOptions: [],
        isTypeIndeterminate: true
      }
    },
    mounted() {
      this.createNoList();

      // 获取所有的班组
      this.getWorkerTeamList();
      // 获取下面所有的工类工种
      this.getTypeByProject();
    },
    methods: {
      // 全选状态选定 班组的
      handleCheckAllChange(val) {
        this.addForm.teamIds = val ? this.idOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedDataChange() {
        let checkedCount = this.addForm.teamIds.length;
        this.checkAll = checkedCount === this.idOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.idOptions.length;
      },
      // 全选状态选定 工类工种的
      handleTypeCheckAllChange(val) {
        this.addForm.typeIds = val ? this.idTypeOptions : [];
        this.isTypeIndeterminate = false;
      },
      handleTypeCheckedDataChange() {
        let checkedCount = this.addForm.typeIds.length;
        this.typeCheckAll = checkedCount === this.idTypeOptions.length;
        this.isTypeIndeterminate = checkedCount > 0 && checkedCount < this.idTypeOptions.length;
      },

      senderChange() {
        this.addForm.typeIds = [];
        this.addForm.teamIds = [];
      },
      // 获取项目下的所有班组
      getWorkerTeamList() {
        var params = {
          'search.projectId': this.formProject.id,
          'pageNo': 1,
          'pageSize': 999
        }
        queryWorkerTeamListInProject(params).then((res) => {
          this.WorkerTeamList = res.data.data.list;
          for (var i = 0; i < this.WorkerTeamList.length; i++) {
            this.idOptions.push(this.WorkerTeamList[i].id)
          }
        })
      },

      // 获取项目下的所有班组
      getTypeByProject() {
        var params = {
          'projectId': this.formProject.id
        }
        getTypeByInProject(params).then((res) => {
          this.WorkerTeamTypeList = res.data.data;
          for (var i = 0; i < this.WorkerTeamTypeList.length; i++) {
            this.idTypeOptions.push(this.WorkerTeamTypeList[i].id)
          }
        })
      },

      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.createNoList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.createNoList();
      },
      //重置
      reset() {
        this.queryForm = {
          title: '',
          dateForm: '',
          projectId: this.formProject.id,
          dateTo: '',
          pageSize: 10,
          pageNo: 1,
        }
        this.time = []
      },
      //通知详情
      lock(item) {
        let parmas = {
          id: item.id
        }
        fetchDetails(parmas).then((res) => {
          this.lockForm = res.data.data;
        })
        this.lockVisible = true;
      },
      //转化时间
      getMyDate(str) {
        var oDate = new Date(str),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间
        return oTime;
      },
      //补0操作
      getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      },

      //通知列表
      createNoList() {
        if (this.time) {
          this.queryForm.dateForm = this.time[0];
          this.queryForm.dateTo = this.time[1];
        } else {
          this.queryForm.dateForm = '';
          this.queryForm.dateTo = '';
        }
        this.loading = true;
        NoList(this.queryForm).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            var arr = res.data.data.list;
            for (var i = 0; i < arr.length; i++) {
              arr[i].opAt = this.getMyDate(arr[i].opAt * 1000)
              if (arr[i].target == 0) {
                arr[i].target = '全部'
              }
              if (arr[i].target == 1) {
                arr[i].target = '班组长'
              }
              if (arr[i].target == 2) {
                arr[i].target = '工友'
              }
              if (arr[i].type == 0) {
                arr[i].type = '文本'
              }
              if (arr[i].type == 1) {
                arr[i].type = '图片'
              }
            }
            this.tableData = arr;
            this.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取通知列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        });
      },
      // 获取所有工类
      workClass() {
        workClass().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            var arr = res.data.data;
            for (var i = 0; i < arr.length; i++) {
              this.workClassOption.push(arr[i])
            }
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取所有工类失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      editGetPro(id) {
        this.addForm.workTypeId = '';
        this.workTypeOption = [
          {
            id: '',
            name: '全部'
          }
        ]
        if (id == '') {
          return;
        }
        var arr = this.workClassOption;
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            var arr2 = arr[i].workTypes;
            for (var j = 0; j < arr2.length; j++) {
              this.workTypeOption.push(arr2[j]);
            }

          }
        }
      },
      add() {
        this.exitVisible = true;
      },
      exitQX() {
        this.exitVisible = false;
        this.typeCheckAll = false;
        this.checkAll = false;
        this.isIndeterminate = true;
        this.isTypeIndeterminate = true;
        this.$refs['addForm'].resetFields();
      },
      exitQD() {
        if (this.addForm.sender == 'WTL') {
          this.addForm.typeIds = ['WM']
        } else if (this.addForm.sender == 'WM') {
          this.addForm.teamIds = ['WTL'];
        } else {
          this.addForm.typeIds = ['WM'];
          this.addForm.teamIds = ['WTL'];
        }
        if(this.addForm.showTV == 0) {
          this.addForm.startTime = '0'
          this.addForm.endTime = '0'
        }

        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            if(parmas.showTV == 0) {
              parmas.startTime = '';
              parmas.endTime = '';
            }
            console.log(parmas)
            createNotification(parmas).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '创建成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.createNoList();
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '创建失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            });
            this.exitQX();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>
<style scoped>
  .bottom10 .el-form-item {
    margin-bottom: 10px !important;
  }

  .box {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 12px;
    color: #606266;
  }

  #add .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  #add .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  #add .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  #add .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  #add .el-checkbox {
    margin: 0 20px 0 0 !important;
  }
</style>
