<template>
  <div class="userappM">
    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>用户名：</p>
        <el-input
          placeholder="请输入用户名"
          size="small"
          class="searchInput"
          v-model="loginname">
        </el-input>
      </div>
      <div class="search">
        <p>真实姓名：</p>
        <el-input
          placeholder="请输入真实姓名"
          size="small"
          class="searchInput"
          v-model="username">
        </el-input>
      </div>

      <div class="search">
        <p>审批状态：</p>
        <el-select v-model="approvalStates" style="width: 200px;" size="small" placeholder="请选择">
          <el-option
            v-for="item in toStateArr"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
        列表
    -->
    <el-table
      class="table"
      :data="listData"
      stripe
      border
      :loading="loading"
      style="width: 100%">
      <el-table-column
        label="用户名"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.loginname ? scope.row.loginname : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="真实姓名"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.username ? scope.row.username : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.phone ? scope.row.phone : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分公司"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.unit ? scope.row.unit.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属角色"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.names ? scope.row.names : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.approvalState }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template scope="scope">
          <el-button
            v-show="scope.row.approvalState === '待审批'"
            size="small"
            type="text"
            @click="handleWork(scope.row)">审批
          </el-button>
          <el-button
            style="margin: 0;"
            v-show="scope.row.approvalState === '已通过' || scope.row.approvalState === '已驳回'"
            size="small"
            type="text"
            @click="handleLook(scope.row)">详情
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


    <!--
        审批dialog
    -->
    <el-dialog :close-on-press-escape="false" title="用户审批" :before-close="cancelState" :visible.sync="approvalVisible"
               :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="130px" :rules="dataFormRules" ref="dataForm">
        <el-form-item class="lookStyleForDiv" label="所属公司">
          <el-input size="small" v-model="dataForm.unit.name" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="所属角色" prop="username">
          <el-input size="small" v-model="dataForm.roleNames" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="用户名" prop="phone">
          <el-input size="small" v-model="dataForm.loginname" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="真实姓名" prop="username">
          <el-input size="small" v-model="dataForm.username" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系方式" prop="phone">
          <el-input size="small" v-model="dataForm.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <div class="doBox">
          <el-form-item label="审批状态">
            <el-radio-group size="small" v-model="approvalStatesA">
              <el-radio label="0">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="approvalStatesA == 2" label="驳回原因" prop="approvalNote">
            <el-input size="small" class="textareaOverflow" :autosize="true" type="textarea"
                      v-model="dataForm.approvalNote" resize="none" :rows=4></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelState">取消</el-button>
        <el-button size="medium" type="primary" @click.native="submitState">提交</el-button>
      </div>
    </el-dialog>

    <!--
        查看
    -->
    <el-dialog :close-on-press-escape="false" title="审批详情" :before-close="cancelState" :visible.sync="approvalVisibleL"
               :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="130px" ref="dataForm">
        <el-form-item class="lookStyleForDiv" label="所属公司">
          <el-input size="small" v-model="dataForm.unit.name" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="所属角色" prop="username">
          <el-input size="small" v-model="dataForm.roleNames" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="用户名" prop="phone">
          <el-input size="small" v-model="dataForm.loginname" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="真实姓名" prop="username">
          <el-input size="small" v-model="dataForm.username" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系方式" prop="phone">
          <el-input size="small" v-model="dataForm.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="审批状态">
          <div style="font-size: 13px; color: #5C6471 !important;">{{ dataForm.approvalState == '0' ? "通过" : "驳回" }}
          </div>
        </el-form-item>
        <el-form-item label="驳回原因" v-show="dataForm.approvalState == 2">
          <el-input size="small" class="textareaOverflow" type="textarea" autosize="true" disabled
                    v-model="dataForm.approvalNote" resize="none" :rows=4></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelState">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getUserList, findUserDe, approvalUserRole} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      return {
        // loading
        loading: true,
        // 搜索条件
        loginname: '',
        username: '',
        approvalStates: '1',
        // 审批状态
        toStateArr: [{
          value: '-1',
          label: '不限'
        }, {
          value: '1',
          label: '待审批'
        }, {
          value: '2',
          label: '已驳回'
        }, {
          value: '0',
          label: '已通过'
        }],

        // 列表数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 审批delog
        approvalVisible: false,
        approvalVisibleL: false,
        dataForm: {
          roleNames: '',
          unit: {
            name: ''
          },
          approvalNote: ''
        },
        dataFormRules: {
          approvalNote: [
            {required: true, message: '驳回原因不能为空!', trigger: 'blur'}
          ]
        },
        approvalStatesA: '0'
      }
    },
    props: {
      //项目id
      project: {
        type: Object
      }
    },
    watch: {
      project: {
        handler: function (val, oldVal) {
          this.companyId = val.projectId;
          var parmas = {
            'companyId': this.companyId,
            'createFrom': 1,
            'username': this.username,
            'loginname': this.loginname,
            'approvalState': this.approvalStates,
            'pageNum': this.thisNowPage,
            'pageSize': this.pageSize,
            'orderBy': 'opAt',
            'order': 'desc'
          }
          this.getList(parmas);
        },
        deep: true
      },
    },
    created() {
      var parmas = {
        'companyId': this.companyId,
        'createFrom': 1,
        'username': this.username,
        'loginname': this.loginname,
        'approvalState': this.approvalStates,
        'pageNum': this.thisNowPage,
        'pageSize': this.pageSize,
        'orderBy': 'opAt',
        'order': 'desc'
      }
      this.getList(parmas);
    },
    methods: {
      // 清空
      clear() {
        this.loginname = '';
        this.username = '';
        this.approvalStates = '1';
      },

      // 搜索
      search() {
        this.thisNowPage = 1;
        var parmas = {
          'companyId': this.companyId,
          'createFrom': 1,
          'username': this.username,
          'loginname': this.loginname,
          'approvalState': this.approvalStates,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.loading = true;
        this.getList(parmas);
      },

      getList(val) {
        getUserList(val).then((res) => {
          this.listData = res.data.data.list;
          for (var i = 0; i < this.listData.length; i++) {
            if (this.listData[i].approvalState == '1') {
              this.listData[i].approvalState = '待审批'
            } else if (this.listData[i].approvalState == '2') {
              this.listData[i].approvalState = '已驳回'
            } else {
              this.listData[i].approvalState = '已通过'
            }
            var names = '';
            for (var j = 0; j < this.listData[i].roles.length; j++) {
              names += this.listData[i].roles[j].name + ',';
              this.listData[i].names = names.substr(0, names.length - 1);
            }
          }
          this.loading = false;
          this.currentPage = res.data.data.pageNo;
          this.totalNum = res.data.data.totalCount;
        })
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        var parmas = {
          'companyId': this.companyId,
          'createFrom': 1,
          'username': this.username,
          'loginname': this.loginname,
          'approvalState': this.approvalStates,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.getList(parmas);
      },
      // 条数更改
      handleSizeChange(val) {
        this.pagesize = val;
        var parmas = {
          'companyId': this.companyId,
          'createFrom': 1,
          'username': this.username,
          'loginname': this.loginname,
          'approvalState': this.approvalStates,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.getList(parmas);
      },

      // 审批
      handleWork(val) {
        this.approvalVisible = true;
        var parmas = {
          userId: val.id
        }
        this.nowId = val.id;
        findUserDe(parmas).then((res) => {
          this.dataForm = res.data.data;
          var name = '';
          for (var i = 0; i < this.dataForm.roles.length; i++) {
            name += this.dataForm.roles[i].name + ',';
          }
          this.dataForm.roleNames = name.substring(0, name.length - 1);
        })
      },

      // 审批提交
      submitState() {
        var parmas = {
          'userId': this.dataForm.id,
          'approvalState': this.approvalStatesA,
          'approvalNote': this.dataForm.approvalNote
        }
        if (this.approvalStatesA == 0) {
          this.dataForm.approvalNote = ' ';
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            approvalUserRole(parmas).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '审批成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '审批失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.cancelState();
              var parmas = {
                'companyId': this.companyId,
                'createFrom': 1,
                'username': this.username,
                'loginname': this.loginname,
                'approvalState': this.approvalStates,
                'pageNum': this.thisNowPage,
                'pageSize': this.pageSize,
                'orderBy': 'opAt',
                'order': 'desc'
              }
              this.dataForm.approvalNote = '';
              this.getList(parmas);
            })
          }
        });
      },

      // 取消提交
      cancelState() {
        this.approvalVisible = false;
        this.approvalVisibleL = false;
        this.approvalStatesA = '0';
        this.dataForm = {
          roleNames: '',
          unit: {
            name: ''
          }
        };
        this.$refs['dataForm'].resetFields();
      },

      // 审批详情
      handleLook(val) {
        var parmas = {
          userId: val.id
        }
        this.nowId = val.id;
        findUserDe(parmas).then((res) => {
          this.dataForm = res.data.data;
          var name = '';
          for (var i = 0; i < this.dataForm.roles.length; i++) {
            name += this.dataForm.roles[i].name + ',';
          }
          this.dataForm.roleNames = name.substring(0, name.length - 1);
          this.approvalVisibleL = true;
        })
      }
    }
  }
</script>
<style>
  .userappM {
    font-size: 0rem;
  }
  .userappM .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .userappM .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .userappM .select {
    width: 100%;
  }

  .userappM .searchBox {
    width: 100%;
    overflow: hidden;
    margin-bottom: .15rem;
    position: relative;
  }

  .userappM .search {
    /*width: 300px;*/
    height: .5rem;
    line-height: .5rem;
    float: left;
  }

  .userappM .search p {
    float: left;
    width: .7rem;
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .userappM .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .userappM .searchBtn {
    position: absolute;
    right: 0;
    top: .13rem;
  }
</style>
