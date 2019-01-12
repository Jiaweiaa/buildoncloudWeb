<template>
  <div class="aloneBtn">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建厂家信息</el-button>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>厂家名称：</p>
        <el-input
          placeholder="请输入厂家名称"
          size="small"
          class="searchInput"
          v-model="search_name">
        </el-input>
      </div>
      <div class="search">
        <p>联系人：</p>
        <el-input
          placeholder="请输入联系人"
          size="small"
          class="searchInput"
          v-model="search_contact">
        </el-input>
      </div>

      <div class="search">
        <p>联系方式：</p>
        <el-input
          size="small"
          class="searchInput"
          placeholder="请输入联系方式"
          v-model="search_contactTel">
        </el-input>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
        新增生产厂家
    -->
    <el-dialog :close-on-press-escape="false" title="创建生产厂家" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="厂家名称" prop="name">
          <el-input size="small" v-model="addForm.name" placeholder="请输入厂家名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input size="small" v-model="addForm.contact" placeholder="请输入联系人" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactTel">
          <el-input size="small" v-model="addForm.contactTel" placeholder="请输入联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂家地址" prop="address">
          <el-input size="small" v-model="addForm.address" placeholder="请输入厂家地址" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" class="textareaOverflow" :autosize="true" type="textarea" :rows="2"
                    v-model="addForm.note" placeholder="请输入备注" auto-complete="off" resize="none"></el-input>
        </el-form-item>
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
      :data="listData"
      border
      stripe
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="厂家名称"
        align="center">
        <template scope="scope">
          <span @click="show(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.name ? scope.row.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.contact ? scope.row.contact : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.contactTel ? scope.row.contactTel : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="厂家地址"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.address ? scope.row.address : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.opAt ? scope.row.opAt : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <!--<el-button-->
          <!--size="small"-->
          <!--type="danger"-->
          <!--@click="deleteEdit(scope.row)">删除</el-button>-->
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
     修改用户
    -->
    <el-dialog :close-on-press-escape="false" title="修改生产厂家" :before-close="editCancelBtn" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="厂家名称" prop="name">
          <el-input size="small" v-model="editForm.name" placeholder="请输入厂家名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input size="small" v-model="editForm.contact" placeholder="请输入联系人" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactTel">
          <el-input size="small" v-model="editForm.contactTel" placeholder="请输入联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂家地址" prop="address">
          <el-input size="small" v-model="editForm.address" placeholder="请输入厂家地址" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" class="textareaOverflow" :autosize="true" style="overflow: hidden;" type="textarea"
                    :rows="2" v-model="editForm.note" placeholder="请输入备注" auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>


    <!--
       查看
    -->
    <el-dialog :close-on-press-escape="false" title="查看生产厂家" :visible.sync="showVisible" :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="80px" ref="editForm">
        <el-form-item class="lookStyleForDiv" label="厂家名称:" prop="name">
          <div>{{editForm.name}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系人:" prop="contact">
          <div>{{editForm.contact}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系方式:" prop="contactTel">
          <div>{{editForm.contactTel}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="厂家地址:" prop="address">
          <div>{{editForm.address}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="备注:" prop="note">
          <div>{{editForm.note}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getManuList, addManu, editManu, deleteManu, checkEqName} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      let parmas = {
        'search.name': this.search_name,
        'search.contact': this.search_contact,
        'search.contactTel': this.search_contactTel,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.getList(parmas);
    },
    data() {
      // 查看校验
      var validaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入生产厂家名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('生产厂家名称不能带有空格！'));
        } else {
          var parmas = {
            name: value
          }
          checkEqName(parmas).then((res) => {
            if (res.data.code == 0) {
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };

      // 编辑校验
      var validaEdName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入生产厂家名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('生产厂家名称不能带有空格！'));
        } else {
          var parmas = {
            name: value,
            id: this.editForm.id
          }
          checkEqName(parmas).then((res) => {
            if (res.data.code == 0) {
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };

      var validPeople = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系人姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('联系人姓名不能带有空格！'));
        } else {
          callback()
        }
      };

      var validPeoplePh = (rule, value, callback) => {
        var reg = /^[1]\d{10}$/;
        if (value === '') {
          callback(new Error('请输入厂家联系方式！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('厂家联系方式不能带有空格！'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入11位手机号！'));
        } else {
          callback()
        }
      };
      return {
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        loading: true,

        // search
        search_name: '',
        search_contact: '',
        search_contactTel: '',

        // 查看
        showVisible: false,

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          name: '',
          contact: '',
          contactTel: '',
          address: '',
          note: ''
        },
        addFormRules: {
          name: [
            {required: true, validator: validaName, trigger: 'blur'},
            {min: 1, max: 20, message: '厂家名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          contact: [
            {required: true, validator: validPeople, trigger: 'blur'},
            {min: 1, max: 15, message: '联系人姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          contactTel: [
            {required: true, validator: validPeoplePh, trigger: 'blur'},
            {min: 1, max: 11, message: '厂家联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ],
          address: [
            {min: 1, max: 50, message: '厂家地址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}

          ]
        },

        // 修改弹出层数据
        editVisible: false,
        editForm: {
          name: '',
          contact: '',
          contactTel: '',
          address: '',
          note: ''
        },
        editFormRules: {
          name: [
            {required: true, validator: validaEdName, trigger: 'blur'},
            {min: 1, max: 20, message: '厂家名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          contact: [
            {required: true, validator: validPeople, trigger: 'blur'},
            {min: 1, max: 15, message: '联系人姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          contactTel: [
            {required: true, validator: validPeoplePh, trigger: 'blur'},
            {min: 1, max: 11, message: '厂家联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ],
          address: [
            {min: 1, max: 50, message: '厂家地址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}

          ]
        }
      }
    },
    methods: {
      // 序列号时间
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
            addManu(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '添加成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                let parmas = {
                  'search.name': this.search_name,
                  'search.contact': this.search_contact,
                  'search.contactTel': this.search_contactTel,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
                this.$refs['addForm'].resetFields();
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
          'search.name': this.search_name,
          'search.contact': this.search_contact,
          'search.contactTel': this.search_contactTel,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },
      clear() {
        this.search_name = '';
        this.search_contact = '';
        this.search_contactTel = '';
      },
      // 获取列表
      getList(val) {
        getManuList(val).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              this.listData[i].opAt = this.getMyDate(this.listData[i].opAt * 1000)
            }
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          }else {
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
          'search.name': this.search_name,
          'search.contact': this.search_contact,
          'search.contactTel': this.search_contactTel,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },

      handleSizeChange(val) {
        this.pageSize = val;
        let parmas = {
          'search.name': this.search_name,
          'search.contact': this.search_contact,
          'search.contactTel': this.search_contactTel,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },

      // 点击编辑
      handleEdit(row) {
        this.editForm = Object.assign({}, row);
        this.editVisible = true;
      },

      // 查看
      show(row) {
        this.editForm = Object.assign({}, row);
        this.showVisible = true;
      },
      ok() {
        this.showVisible = false;
        this.$refs['editForm'].resetFields();

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
            var data = {
              id: parmas.id,
              name: parmas.name,
              address: parmas.address,
              contact: parmas.contact,
              contactTel: parmas.contactTel,
              note: parmas.note
            }
            editManu(data).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '修改成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                let parmas = {
                  'search.name': this.search_name,
                  'search.contact': this.search_contact,
                  'search.contactTel': this.search_contactTel,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
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
            });
          }
        });
      },

      // 删除厂家
      deleteEdit(value) {
        this.$confirm('确认删除该厂家吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var parmas = {
            id: value.id
          }
          deleteManu(parmas).then((res) => {
            if (res.data.code == '0') {
              let parmas = {
                'search.name': this.search_name,
                'search.contact': this.search_contact,
                'search.contactTel': this.search_contactTel,
                'pageNo': this.thisNowPage,
                'pageSize': this.pageSize
              }
              this.getList(parmas);
              myCallback.call(this,res);
              // this.$notify.success({
              //   title: '删除成功',
              //   message: res.data.msg,
              //   offset: 100
              // });
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '删除失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
          this.$notify.info({
            title: '已取消删除!',
            // offset: 100
          });
        });
      }
    }
  }
</script>
<style>
  .aloneBtn {
    font-size: 0rem;
  }
  .aloneBtn .lookStyleForDiv div {
    font-size: .12rem;
    color: #5C6471;
  }

  .aloneBtn .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .aloneBtn .select {
    width: 100%;
  }

  .aloneBtn .searchBox {
    width: 100%;
    overflow: hidden;
    margin-bottom: .15rem;
    position: relative;
  }

  .aloneBtn .search {
    /*width: 300px;*/
    height: .5rem;
    line-height: .5rem;
    float: left;
    margin-right: .1rem;
  }

  .aloneBtn .search p {
    float: left;
    /*width: 70px;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .aloneBtn .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .aloneBtn .searchBtn {
    position: absolute;
    right: 0;
    top: .1rem;
  }
</style>
