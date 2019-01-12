<template>
  <div class="sysM">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建用户</el-button>

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
          size="small"
          class="searchInput"
          placeholder="请输入真实姓名"
          v-model="username">
        </el-input>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" type="primary" :loading="loading" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
        新增用户
    -->
    <el-dialog title="创建用户" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="addVisible"
               :before-close="cencelBtn">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="所属公司" prop="unitId">
          <el-select size="small" class="select" filterable v-model="addForm.unitId" placeholder="请选择所属公司"
                     @change="changeUnitId">
            <el-option
              v-for="item in workerList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleCodes">
          <el-select size="small" class="select" filterable v-model="addForm.roleCodes" multiple placeholder="请选择所属角色">
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input size="small" v-model="addForm.loginName" placeholder="请输入用户名(公司邮箱)" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="username">
          <el-input size="small" v-model="addForm.username" placeholder="请输入真实姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input size="small" v-model="addForm.phone" placeholder="请输入联系电话" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="初始密码"  prop="pwd">-->
        <!--<el-input size="small" :type="this.passType" v-model="addForm.pwd" placeholder="请输入初始密码">-->
        <!--<i class="el-icon-view el-input__icon"-->
        <!--style="width: 40px; cursor: pointer;"-->
        <!--slot="suffix"-->
        <!--@click="seePass">-->
        <!--</i>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cencelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        页面列表
    -->
    <el-table
      class="table"
      v-loading="loading"
      stripe
      :data="listData"
      border
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
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.names ? scope.row.names : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="80px;"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.disabled ? scope.row.disabled : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        width="80px;"
        align="center">
        <template scope="scope">
          <el-popover v-show="scope.row.approvalState === '驳回'" trigger="hover" placement="top">
            <p>驳回原因: {{ scope.row.approvalNote }}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.approvalState ? scope.row.approvalState : ''}}</span>
            </div>
          </el-popover>
          <span
            v-show="scope.row.approvalState !== '驳回'">{{ scope.row.approvalState ? scope.row.approvalState : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            v-show="scope.row.disabled ==='禁用'  && isTopAdmin"
            size="small"
            type="text"
            @click="closeEdit(scope.row)">启用
          </el-button>
          <el-button
            v-show="scope.row.disabled ==='正常' && isTopAdmin"
            size="small"
            type="text"
            @click="openEdit(scope.row)">禁用
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
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>

    <!--
     修改用户
    -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="修改用户" :visible.sync="editVisible"
               :before-close="editCancelBtn">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属公司" prop="unitId">
          <el-select size="small" class="select" filterable v-model="editForm.unitId" placeholder="请选择所属公司"
                     @change="changeEditUnitId">
            <el-option
              v-for="item in workerList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleCodes">
          <el-select size="small" class="select" filterable v-model="editForm.roleCodes" multiple placeholder="请选择所属角色">
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input size="small" v-model="editForm.loginName" placeholder="请输入用户名(公司邮箱)" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="username">
          <el-input size="small" v-model="editForm.username" placeholder="请输入真实姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input size="small" v-model="editForm.phone" placeholder="请输入联系电话" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">{{this.editName}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    loginOut,
    getAdmin,
    getUserList,
    addUser,
    editUser,
    getUserCompany,
    getUserRole,
    requiredEmail,
    requiredPhone,
    findUserDe,
    openCloseEq
  } from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    created() {
      this.getAdminData();
      this.companyId = this.project.projectId;
      this.addForm.unitId = this.companyId;
      var parmasa = {
        unitId: this.companyId
      }
      getUserRole(parmasa).then((res) => {
        if (!res) {
          return;
        }
        this.roleList = res.data.data;
      })
      let parmas = {
        'companyId': this.companyId,
        'approvalState': -1,
        'loginname': this.loginname,
        'username': this.username,
        'pageNum': this.thisNowPage,
        'pageSize': this.pagesize,
        'orderBy': 'opAt',
        'order': 'desc'
      }
      this.getList(parmas);
      this.getCompany();
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
          this.addForm.unitId = this.companyId;
          let parmas = {
            'companyId': this.companyId,
            'approvalState': -1,
            'loginname': this.loginname,
            'username': this.username,
            'pageNum': this.thisNowPage,
            'pageSize': this.pagesize,
            'orderBy': 'opAt',
            'order': 'desc'
          }
          this.getList(parmas);
        },
        deep: true
      },
    },
    data() {
      // 校验手机
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入11位手机号！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            var parmas = {
              'phone': value
            }
            requiredPhone(parmas).then((res) => {
              if (res.data.code == 0) {
                if (res.data.data === false) {
                  callback('手机号已被使用!');
                } else {
                  callback();
                }
              } else {
                callback(res.data.msg);
              }
            })
          }
        }
      };

      // 校验邮箱
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱！'));
        } else {
          var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的邮箱！'));
          } else {
            var parmas = {
              'email': value
            }
            requiredEmail(parmas).then((res) => {
              if (res.data.code == 0) {
                if (res.data.data === false) {
                  callback('该邮箱已被使用!');
                } else {
                  callback();
                }
              } else {
                callback(res.data.msg);
              }
            })
          }
        }
      };

      // 校验手机
      var validateEdPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入11位手机号！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            var parmas = {
              'phone': value,
              'original': this.phoneBe
            }
            requiredPhone(parmas).then((res) => {
              if (res.data.code == 0) {
                if (res.data.data === false) {
                  callback('手机号已被使用!');
                } else {
                  callback();
                }
              } else {
                callback(res.data.msg);
              }
            })
          }
        }
      };

      // 校验邮箱
      var validateEdEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱！'));
        } else {
          var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的邮箱！'));
          } else {
            var parmas = {
              'email': value,
              'original': this.emailBe
            }
            requiredEmail(parmas).then((res) => {
              if (res.data.code == 0) {
                if (res.data.data === false) {
                  callback('该邮箱已被使用!');
                } else {
                  callback();
                }
              } else {
                callback(res.data.msg);
              }
            })
          }
        }
      };
      // 密码
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码!'));
        } else {
          var reg = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}/;
          if (!reg.test(value)) {
            callback(new Error('密码不能少于6位或多于12位!'));
          } else {
            callback();
          }
        }
      };

      var validEdName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入真实姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('真实姓名不能带有空格！'));
        } else {
          callback()
        }
      };
      return {
        // 提交名称
        editName: '保存',

        // 登陆者信息
        adminData: [],
        userId: '',
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pagesize: 10,

        thisNowPage: 1,

        // 权限开关
        isTopAdmin: false,

        loading: true,

        // 输入框状态类
        passType: 'password',

        // 公司列表
        workerList: [],
        // 权限列表
        roleList: [],

        // search 用户名和真实姓名
        loginname: '',
        username: '',

        // phone和email
        phoneBe: '',
        emailBe: '',

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          unitId: '',
          roleCodes: [],
          loginName: '',
          phone: '',
          username: ''
//                    pwd: ''
        },
        addFormRules: {
          unitId: [
            {required: true, message: '请选择所属公司!', trigger: 'change'}
          ],
          roleCodes: [
            {required: true, type: 'array', message: '请输入所属角色!', trigger: 'change'}
          ],
          loginName: [
            {required: true, validator: validateEmail, trigger: 'blur'},
            {min: 1, max: 50, message: '用户名最大长度不能超过50个字符!', trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur'},
            {min: 1, max: 11, message: '联系电话最大长度不能超过11个字符!', trigger: 'blur'}
          ],
          username: [
            {required: true, validator: validEdName, trigger: 'blur'},
            {min: 1, max: 15, message: '真实姓名最大长度不能超过15个字符!', trigger: 'blur'}
          ]
//                    pwd: [
//                        {required: true, validator: validatePass, trigger: 'blur'}
//                    ]
        },

        // 修改弹出层数据
        editVisible: false,
        editForm: {
          unitId: '',
          roleCodes: []
        },
        editFormRules: {
          unitId: [
            {required: true, message: '请选择所属公司!', trigger: 'change'}
          ],
          roleCodes: [
            {required: true, type: 'array', message: '请输入所属角色!', trigger: 'change'}
          ],
          loginName: [
            {required: true, validator: validateEdEmail, trigger: 'blur'},
            {min: 1, max: 50, message: '用户名最大长度不能超过50个字符!', trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: validateEdPhone, trigger: 'blur'},
            {min: 1, max: 11, message: '联系电话最大长度不能超过11个字符!', trigger: 'blur'}
          ],
          username: [
            {required: true, validator: validEdName, trigger: 'blur'},
            {min: 1, max: 15, message: '真实姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          pwd: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //获取登陆信息
      getAdminData() {
        getAdmin().then((res) => {
          if (!res) {
            return;
          }
          this.adminData = res.data.data.roles;
          this.userId = res.data.data.id;
          for (var i = 0; i < this.adminData.length; i++) {
            if (this.adminData[i].name === '总公司管理员') {
              this.isTopAdmin = true;
              return;
            } else {
              this.isTopAdmin = false;
            }
          }
        })
      },

      // 改变
      changeUnitId(val) {
        var parmas = {
          unitId: val
        }
        this.addForm.roleCodes = [];
        this.roleList = [];
        getUserRole(parmas).then((res) => {
          this.roleList = res.data.data;
        })
      },
      changeEditUnitId(val) {
        var parmas = {
          unitId: val
        }
        this.editForm.roleCodes = [];
        this.roleList = [];
        getUserRole(parmas).then((res) => {
          this.roleList = res.data.data;
        })
      },

      // 获取公司列表
      getCompany() {
        getUserCompany().then((res) => {
          if (!res) {
            return;
          }
          this.workerList = res.data.data.list;
        })
      },
      // 点击显示password或者text
      seePass() {
        if (this.passType == 'password') {
          this.passType = 'text';
        } else {
          this.passType = 'password';
        }
      },
      // 点击创建
      clickAdd() {
        this.addVisible = true;
      },
      // 取消提交
      cencelBtn() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
      },
      // 确认提交
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            this.addVisible = false;
            this.$refs['addForm'].resetFields();
            addUser(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '添加成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmasS = {
                  'companyId': this.companyId,
                  'approvalState': -1,
                  'loginname': this.loginname,
                  'username': this.username,
                  'pageNum': this.thisNowPage,
                  'pageSize': this.pagesize,
                  'orderBy': 'opAt',
                  'order': 'desc'
                }
                this.getList(parmasS);
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        });
      },

      search() {
        this.thisNowPage = 1;
        let parmas = {
          'companyId': this.companyId,
          'loginname': this.loginname,
          'username': this.username,
          'approvalState': -1,
          'pageNum': this.thisNowPage,
          'pageSize': this.pagesize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.loading = true;
        this.getList(parmas);
      },
      clear() {
        this.loginname = '';
        this.username = '';
      },
      // 获取列表
      getList(val) {
        getUserList(val).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              if (this.listData[i].disabled !== false) {
                this.listData[i].disabled = '禁用'
              } else {
                this.listData[i].disabled = '正常'
              }
              if (this.listData[i].approvalState == 0) {
                this.listData[i].approvalState = '通过'
              } else if (this.listData[i].approvalState == 1) {
                this.listData[i].approvalState = '待审'
              } else {
                this.listData[i].approvalState = '驳回'
              }
              var names = '';
              for (var j = 0; j < this.listData[i].roles.length; j++) {
                names += this.listData[i].roles[j].name + ',';
                this.listData[i].names = names.substr(0, names.length - 1);
              }
            }
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        let parmas = {
          'companyId': this.companyId,
          'loginname': this.loginname,
          'username': this.username,
          'approvalState': -1,
          'pageNum': this.thisNowPage,
          'pageSize': this.pagesize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.getList(parmas);
      },
      // 条数更改
      handleSizeChange(val) {
        this.pagesize = val;
        let parmas = {
          'companyId': this.companyId,
          'loginname': this.loginname,
          'username': this.username,
          'pageNum': this.thisNowPage,
          'approvalState': -1,
          'pageSize': this.pagesize,
          'orderBy': 'opAt',
          'order': 'desc'
        }
        this.getList(parmas);
      },

      // 点击编辑
      handleEdit(row) {
        if (row.approvalState == '驳回') {
          this.editName = '重新提交';
        } else {
          this.editName = '保存';
        }
        var params = {
          userId: row.id
        }
        var data = '';
        var parmasa = {
          unitId: row.unit.id
        }
        getUserRole(parmasa).then((res) => {
          this.roleList = res.data.data;
        })
        findUserDe(params).then((res) => {
          if (res.data.code == 0) {
            data = res.data.data;
            var arr = [];
            for (var i = 0; i < data.roles.length; i++) {
              arr.push(data.roles[i].code);
            }
            this.editForm = {
              'userId': row.id,
              'unitId': data.unit.id,
              'roleCodes': arr,
              'loginName': data.loginname,
              'username': data.username,
              'phone': data.phone
            }
            this.emailBe = data.loginname;
            this.phoneBe = data.phone;
            this.editVisible = true;
          } else {
            console.log('获取编辑数据失败')
          }
        });
      },
      // 取消编辑提交
      editCancelBtn() {
        this.editVisible = false;
        this.$refs['editForm'].resetFields();
      },
      // 点击提交
      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let parmas = Object.assign({}, this.editForm);
            if (parmas.userId == this.userId) {
              for (var i = 0; i < parmas.roleCodes.length; i++) {
                if (parmas.roleCodes[i] == "HEAD_OFFICE_ADMIN") {
                  this.sameFunAllU(parmas);
                  return;
                }
              }
              editUser(parmas).then((res) => {
                if (res.data.code == '0') {
//                  let parmas = {
//                    'companyId': this.companyId,
//                    'loginname': this.loginname,
//                    'username': this.username,
//                    'pageNum': this.thisNowPage,
//                    'pageSize': this.pagesize,
//                    'approvalState': -1
//                  };
                  this.$router.push({
                    path: '/login'
                  })
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '用户权限变更,请重新登录',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                  loginOut().then((res) => {
                    localStorage.removeItem('ms_username')
                  })
                } else {
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '修改失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                  this.editVisible = false;
                  this.editForm = {
                    unitId: '',
                    roleCodes: []
                  };
                }
              });
            } else {
              this.sameFunAllU(parmas);
            }
          }
        });
      },

      // 公共函数
      sameFunAllU(parmas) {
        editUser(parmas).then((res) => {
          if (res.data.code == '0') {
            let parmas = {
              'companyId': this.companyId,
              'loginname': this.loginname,
              'username': this.username,
              'pageNum': this.thisNowPage,
              'pageSize': this.pagesize,
              'approvalState': -1,
              'orderBy': 'opAt',
              'order': 'desc'
            }
            this.getList(parmas);
            myCallback.call(this,res);
            // this.$notify.success({
            //   title: '修改成功',
            //   // message: res.data.msg,
            //   // offset: 100
            // });
            this.editVisible = false;
            this.editForm = {
              unitId: '',
              roleCodes: []
            };
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '修改失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
            this.editVisible = false;
            this.editForm = {
              unitId: '',
              roleCodes: []
            };
          }
        });
      },

      // 禁用
      openEdit(value) {
        this.$confirm('确认禁用该用户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var parmas = {
            userId: value.id,
            lockState: 'LOCK'
          }
          openCloseEq(parmas).then((res) => {
            let parmas = {
              'companyId': this.companyId,
              'loginname': this.loginname,
              'username': this.username,
              'pageNum': this.thisNowPage,
              'approvalState': -1,
              'pageSize': this.pagesize,
              'orderBy': 'opAt',
              'order': 'desc'
            }
            this.getList(parmas);
            if (res.data.code == '0') {
              myCallback.call(this,res);
              // this.$notify.success({
              //   title: '禁用成功',
              //   // message: res.data.msg,
              //   // offset: 100
              // });
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '禁用失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {
        })
      },
      // 启用
      closeEdit(value) {
        this.$confirm('确认启用该用户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var parmas = {
            userId: value.id,
            lockState: 'UNLOCK'
          }
          openCloseEq(parmas).then((res) => {
            let parmas = {
              'companyId': this.companyId,
              'loginname': this.loginname,
              'username': this.username,
              'approvalState': -1,
              'pageNum': this.thisNowPage,
              'pageSize': this.pagesize,
              'orderBy': 'opAt',
              'order': 'desc'
            }
            this.getList(parmas);
            if (res.data.code == '0') {
              myCallback.call(this,res);
              // this.$notify.success({
              //   title: '启用成功',
              //   // message: res.data.msg,
              //   // offset: 100
              // });
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '启用失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
<style>
  .sysM {
    font-size: 0rem;
  }
  .sysM .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .sysM .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .sysM .select {
    width: 100%;
  }

  .sysM .searchBox {
    width: 100%;
    overflow: hidden;
    margin-bottom: .15rem;
    position: relative;
  }

  .sysM .search {
    /*width: 3rem;*/
    height: .5rem;
    line-height: .5rem;
    float: left;
    margin-right: .1rem;
  }

  .sysM .search p {
    float: left;
    /*width: .7rem;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .sysM .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .sysM .searchBtn {
    position: absolute;
    right: 0;
    top: .1rem;
  }
</style>
