<template>
  <div class="branchMa">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="createCompany">创建分公司</el-button>


    <!--
        列表
    -->
    <el-table
      class="table"
      :data="listData"
      stripe
      :loading="loading"
      border
      >
      <el-table-column
        label="公司名称"
        align="center"
        min-width="30%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
        min-width="40%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        align="center"
        min-width="20%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleEdit(scope.row)">编辑
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
        新增公司
    -->
    <el-dialog :close-on-press-escape="false" title="创建分公司" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="公司名称" prop="name">
          <el-input size="small" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input size="small" v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input size="small" v-model="addForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司介绍" prop="note">
          <el-input size="small" type="textarea" :autosize="true" class="textareaOverflow" v-model="addForm.note"
                    :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cencelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        编辑公司
    -->
    <el-dialog :close-on-press-escape="false" title="编辑分公司" :before-close="editCancelBtn" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="公司名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input size="small" v-model="editForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input size="small" v-model="editForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司介绍" prop="note">
          <el-input size="small" type="textarea" :autosize="true" class="textareaOverflow" v-model="editForm.note"
                    :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getCompanyList, addCompany, editCompany, checkCompanyName} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      var parmas = {
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.getList(parmas);
    },
    data() {
      // 校验分公司名称
      var validWorkerName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入公司名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('公司名称不能带有空格！'));
        } else {
          var parmas = {
            name: value
          }
          checkCompanyName(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };
      // 编辑分公司名称校验
      var validEdWorkerName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('公司名称不能带有空格！'));
        } else {
          var parmas = {
            name: value,
            id: this.editForm.id
          }
          checkCompanyName(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };

      var validEdaddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司地址！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('公司地址不能带有空格！'));
        } else {
          callback()
        }
      };

      var validEdtelephone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系电话！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('联系电话不能带有空格!'));
        } else {
          callback()
        }
      };

      return {
        loading: true,
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          name: '',
          address: '',
          telephone: ''
        },
        addFormRules: {
          name: [
            {required: true, validator: validWorkerName, trigger: 'blur'},
            {min: 1, max: 20, message: '公司名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          address: [
            {min: 1, max: 50, message: '公司地址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          telephone: [
            {min: 1, max: 15, message: '联系电话最大长度不能超过15个字符', trigger: 'blur'}
          ]
        },

        // 修改弹出层数据
        editVisible: false,
        editForm: {
          name: '',
          address: '',
          telephone: ''
        },
        editFormRules: {
          name: [
            {required: true, validator: validEdWorkerName, trigger: 'blur'},
            {min: 1, max: 20, message: '公司名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          address: [
            {min: 1, max: 50, message: '公司地址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          telephone: [
            {min: 1, max: 15, message: '联系电话最大长度不能超过15个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 获取列表
      getList(val) {
        getCompanyList(val).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
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
        var parmas = {
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        var parmas = {
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },

      // 点击创建
      createCompany() {
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
            let parmas = Object.assign({}, this.addForm);
            addCompany(parmas).then((res) => {
              if (res.data.code == '0') {
                var parmas = {
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '新增成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.addVisible = false;
                this.$refs['addForm'].resetFields();
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '新增失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.addVisible = false;
                this.$refs['addForm'].resetFields();
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        });
      },

      // 点击编辑
      handleEdit(row) {
        this.editForm = Object.assign({}, row);
        this.editVisible = true;
      },
      // 取消编辑提交
      editCancelBtn() {
        this.editVisible = false;
        this.editForm = {};
      },
      // 点击提交
      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let parmas = Object.assign({}, this.editForm);
            var data = {
              id: parmas.id,
              name: parmas.name,
              address: parmas.address,
              telephone: parmas.telephone,
              note: parmas.note
            }
            editCompany(data).then((res) => {
              if (res.data.code == '0') {
                var parmas = {
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.editVisible = false;
                this.editForm = {};
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '修改失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.editVisible = false;
                this.editForm = {};
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        });
      }

    }
  }
</script>
<style slop-scope>
  .branchMa .btn {
    border-radius: 20px;
    margin-bottom: 18px !important;
  }

  .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }
</style>
