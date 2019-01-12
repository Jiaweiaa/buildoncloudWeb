<template>
  <div class="projectcontent">
    <el-form :model="formProject" ref="formAdd" label-width="150px" class="demo-ruleForm" size="small">
      <div style="width: 100%;overflow: hidden;font-size: 12fpx;">
        <div style="width: 50%;float: left;">
          <el-form-item label="项目名称：">
            <span>{{formProject.name}}</span>
          </el-form-item>
          <el-form-item label="项目地址：">
            <p>{{formProject.address}}</p>
          </el-form-item>
          <el-form-item label="项目类型：">
            <p>{{formProject.projectType.name}}</p>
          </el-form-item>
          <el-form-item label="开工日期：">
            <p>{{formProject.startDate}}</p>
          </el-form-item>
          <el-form-item label="楼栋数：">
            <p>{{formProject.buildNum}}</p>
          </el-form-item>
          <el-form-item label="面积：">
            <p>{{formProject.area}}</p>
          </el-form-item>
          <el-form-item label="项目经理：" style="position: relative;">
            <i class="el-icon-edit"
               style="position: absolute; right: 10%; top: 8px; color:#409EFF; cursor: pointer; font-size: 14px;"
               v-if="states!=2 && editRole == 0"
               @click="editProjectManger"></i>
            <p style="float: left; margin-right: 10px;">{{formProject.projectManager.username}}</p>
            ({{formProject.projectManager.email}})
            <p>{{formProject.projectManager.phone}}</p>
          </el-form-item>
        </div>
        <div style="width: 50%;float: left;">
          <el-form-item label="所属分公司：">
            <p>{{formProject.unit.name}}</p>
          </el-form-item>
          <el-form-item label="开发商名称：">
            <p>{{formProject.developerName}}</p>
          </el-form-item>
          <el-form-item style="margin-top: 70px;" label="竣工日期：">
            <p>{{formProject.completionDate}}</p>
          </el-form-item>
          <el-form-item label="户数：">
            <p>{{formProject.householdNum}}</p>
          </el-form-item>
          <el-form-item label="项目描述：">
            <p>{{formProject.projectDescribe}}</p>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!--
      更改项目经理
    -->
    <el-dialog title="更改项目经理" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="editSys" :rules="editSysForm" ref="editSys">
        <el-form-item label="项目经理：" prop="projectManagerId">
          <el-select
            v-model="editSys.projectManagerId"
            filterable
            remote
            clearable
            style="width: 200px;"
            size="small"
            resize="none"
            reserve-keyword
            :remote-method="getPeople"
            placeholder="企业邮箱"
            loading-text="请输入最少5位"
            :loading="editSysLoading">
            <el-option
              v-for="item in projectManagerOption"
              :key="item.id"
              :label="item.username"
              :value="item.id">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.loginname}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="font-size: 0rem">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!--
      项目管理员
    -->
    <el-dialog title="新增项目管理员" :visible.sync="dialogFormVisibleByMore" width="500px">
      <el-form class="elForm" :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名：" prop="sysUserId">
          <el-select
            v-model="addForm.sysUserId"
            filterable
            style="width: 350px;"
            remote
            clearable
            size="small"
            resize="none"
            reserve-keyword
            :remote-method="getPeople"
            placeholder="请输入管理人员邮箱进行查询"
            loading-text="请输入最少5位"
            :loading="addLoading">
            <el-option
              v-for="item in projectManagerOption"
              :key="item.id"
              :label="item.username"
              :value="item.id">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.loginname}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位：" prop="projectJobId">
          <el-select style="width: 350px;" size="small" v-model="addForm.projectJobId" clearable placeholder="请选择">
            <el-option
              v-for="item in projectJobList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="font-size: 0rem">
        <el-button size="small" @click="cancelAdd">取 消</el-button>
        <el-button size="small" type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>

    <!--
        新增按钮
    -->
    <el-button size="small" v-if="states!=2" type="primary" style="margin: 20px;" @click="clickAdd">新增项目管理人员</el-button>


    <el-table
      class="table"
      :data="listData"
      stripe
      border
      :loading="loading"
      style="width: 100%">
      <el-table-column
        label="管理员姓名"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.sysUser ? scope.row.sysUser.username : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="管理员职位"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.projectJob ? scope.row.projectJob.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" v-if="states!=2" label="操作" width="100px">
        <template scope="scope">
          <el-button
            style="margin: 0;"
            size="small"
            type="danger"
            @click="deleteThis(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      分页
      current-change  改变当前页的回调
      page-size 每页的数据个数
      total 数据条数总数
      current-page.sync 数据总页
   -->
    <el-pagination
      class="pageCurrent"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>
<script>
  import {
    fuzzyQuery
  } from '../../api/projectapi'
  import {
    editProjectAdmin,
    getProjectJobList,
    addProjectController,
    getProjectControllerList,
    delProjectController,
    checkRoles01
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
    created() {
      // 获取所有职位
      this.getJobList();
      // 获取列表
      this.getList()
      // 拿取更改项目经理权限
      checkRoles01().then((res) => {
        this.editRole = res.data.msg;
      })
    },
    data() {
      var checkNull = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('请选择对应负责人'));
        }
        callback();
      };
      var checkJob = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('请选择职位'));
        }
        callback();
      };
      return {
        // 编辑权限
        editRole: '',
        // 列表
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,
        loading: true,
        // 项目经理更改
        dialogFormVisible: false,
        editSys: {
          projectManagerId: ''
        },
        projectManagerOption: [],

        // 编辑项目经理
        editSysLoading: false,
        editSysForm: {
          projectManagerId: [
            {required: true, validator: checkNull, trigger: 'change'}
          ]
        },

        projectJobList: [],
        // 项目管理员
        dialogFormVisibleByMore: false,
        addForm: {
          'projectId': this.formProject.id,
          'sysUserId': '',
          'projectJobId': ''
        },
        addFormRules: {
          sysUserId: [
            {required: true, validator: checkNull, trigger: 'change'}
          ],
          projectJobId: [
            {required: true, validator: checkJob, trigger: 'change'}
          ]
        },

        // 搜索条件
        searchForm: {
          pageNo: '',
          pageSize: '',
          projectId: this.formProject.id
        }
      }
    },
    methods: {
      // 删除
      deleteThis(row) {
        console.log(row)
        this.$confirm('确认删除该管理员吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let parmas = {
            'id': row.id,
            'projectId': row.projectId,
            'projectJobId':row.projectJobId,
            'sysUserId': row.sysUserId
          };
          delProjectController(parmas).then((res) => {
            if (res.data.code == 0) {
              this.searchForm.pageNo = 1;
              this.getList();
              this.$notify.success({
                title: '删除成功',
                offset: 100
              });
            } else {
              this.$notify.error({
                title: '操作失败',
                message: res.data.data.msg,
                offset: 100
              });
            }
          })
        }).catch(() => {

        })
      },
      // 获取列表
      getList() {
        getProjectControllerList(this.searchForm).then((res) => {
          this.listData = [];
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取管理员列表失败',
            //   message: res.data.data.msg,
            //   offset: 100
            // });
          }
          this.loading = false;
        })
      },
      handleCurrentChange(value) {
        this.searchForm.pageNo = value;
        this.getList();
      },
      handleSizeChange(value) {
        this.searchForm.pageSize = value;
        this.getList();
      },
      // 添加职位
      addProject() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm)
            addProjectController(parmas).then((res) => {
              if (res.data.code == 0) {
                this.$notify.success({
                  title: '添加成功',
                  offset: 100
                });
                this.getList();
              } else {
                this.$notify.error({
                  title: '添加失败',
                  message: res.data.msg,
                  offset: 100
                });
              }
              this.cancelAdd();
              this.$refs['addForm'].resetFields();
            })
          }
        })
      },
      // 获取所有职位
      getJobList() {
        getProjectJobList().then((res) => {
          if (res.data.code == 0) {
            this.projectJobList = res.data.data;
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取管理员职位失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //解决远程搜索IE兼容问题
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      // 获取管理员列表
      getPeople(val) {
        this.editSysLoading = true;
        if (val.length < 5) {
          this.projectManagerOption = [];
          return;
        }
        if (val !== '') {
          var data = {
            key: val,
            unitId: this.formProject.unitId,
            roleCode: 'PROJECT_COMMISSIONER',
            pageNum: 1,
            pageSize: 10,
            simple: true
          }
          fuzzyQuery(data).then((res) => {
            if (res.data.code == 0) {
              this.editSysLoading = false;
              this.projectManagerOption = res.data.data.list;
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
      // 编辑项目经理
      editProjectManger() {
        this.dialogFormVisible = true;
      },
      // 提交编辑申请
      submit() {
        this.$refs['editSys'].validate((valid) => {
          if (valid) {
            var parmas = {
              projectId: this.formProject.id,
              projectManagerId: this.editSys.projectManagerId
            }
            editProjectAdmin(parmas).then(res => {
              if (res.data.code == 0) {
                this.formProject.projectManager = res.data.data;
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '更换失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.cancel();
            })
          }
        })
      },
      // 取消编辑申请
      cancel() {
        this.dialogFormVisible = false;
        this.projectManagerOption = [];
        this.$refs['editSys'].resetFields();
      },
      cancelAdd() {
        this.dialogFormVisibleByMore = false;
        this.projectManagerOption = [];
        this.$refs['addForm'].resetFields();
      },
      // 新增项目管理员
      clickAdd() {
        this.dialogFormVisibleByMore = true;
      }

    }
  }
</script>
<style scoped>
  .projectcontent {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: .2rem;
    padding-left: .2rem;
    padding-right: .2rem;
  }

  .projectcontent .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }
</style>
<style>
  。projectcontent .el-form-item__content {
    font-size: 12px;
  }

  .projectcontent .elForm .el-form-item__error {
    left: 60px;
  }
  .el-form-item__label {
    line-height: .4rem;
  }
  .el-form-item__error {
    /*left: 80px;*/
  }
</style>
