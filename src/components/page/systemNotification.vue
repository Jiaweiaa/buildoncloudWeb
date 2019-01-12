<template>
  <div class="box">
    <!--创建通知-->
    <el-dialog :close-on-press-escape="false" id="add" @close="exitQX" top=".5rem" title="创建通知"
               :visible.sync="exitVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="1.1rem" :rules="addFormRules" ref="addForm">
        <el-form-item label="通知标题" prop="title">
          <el-input size="small" v-model="addForm.title" placeholder="请输入通知标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            size="small"
            v-model="addForm.time"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地点" prop="address">
          <el-input size="small" v-model="addForm.address" placeholder="请输入地点" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="事项" prop="content">
          <el-input
            :autosize="true"
            resize="none"
            size="small"
            type="textarea"
            :rows="4"
            class="textareaOverflow"
            placeholder="请输入内容"
            v-model="addForm.content">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            :autosize="true"
            resize="none"
            size="small"
            type="textarea"
            :rows="4"
            class="textareaOverflow"
            placeholder="请输入备注内容"
            v-model="addForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="exitQX">取消</el-button>
        <el-button size="medium" type="primary" @click.native="exitQD">发布</el-button>
      </div>
    </el-dialog>
    <!--查看通知-->
    <el-dialog :close-on-press-escape="false" id="cock" top=".5rem" title="
项目通知详情" :visible.sync="lockVisible" :close-on-click-modal="false">
      <el-form :model="lockFrom" label-width="1.1rem" ref="lockFrom">
        <el-form-item label="通知标题:">
          <p>{{lockFrom.title}}</p>
        </el-form-item>
        <el-form-item label="时间:">
          <p>{{lockFrom.time}}</p>
        </el-form-item>
        <el-form-item label="地点:">
          <p>{{lockFrom.address}}</p>
        </el-form-item>
        <el-form-item label="事项:">
          <p>{{lockFrom.content}}</p>
        </el-form-item>
        <el-form-item label="备注:">
          <p>{{lockFrom.remark}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="lockVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" @click="add" size="medium" style="margin-bottom: .2rem;">创建通知</el-button>

    <div style="position: relative;">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item label="通知标题">
          <el-input v-model="queryForm.title" size="small" placeholder="请输入通知标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="time"
            type="daterange"
            size="small"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button style="position: absolute;right: 1rem;top: .05rem;" size="small" @click="reset" icon="el-icon-refresh">
          重置
        </el-button>
        <el-button style="position: absolute;right: .1rem;top: .05rem;" size="small" type="primary" icon="el-icon-search"
                   @click="createNoList">搜索
        </el-button>
      </el-form>
    </div>

    <!--列表-->
    <el-table v-loading.body="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              stripe
              style="width: 100%">
      <el-table-column
        label="通知标题" align="center">
        <template scope="scope">
          <p @click="lock(scope.row)" style="color:#409EFF;cursor: pointer;">{{ scope.row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template scope="scope">
          <p>{{ scope.row.opAt}}</p>
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
  </div>
</template>
<script>
  import {
    getNotification,
    createNotification
  } from '../../api/api'
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      return {
        exitVisible: false,
        queryForm: {
          title: '',
          dateFrom: '',
          dateTo: '',
          pageSize: 10,
          pageNo: 1,
        },
        addForm: {
          title: '',
          address: '',
          time: '',
          content: '',
          remark: ''
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入通知标题', trigger: 'blur'},
            {min: 1, max: 50, message: '通知标题最大长度不能超过50个字符', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请输入时间', trigger: 'blur'},
            {min: 1, max: 50, message: '时间最大长度不能超过50个字符', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入地点', trigger: 'blur'},
            {min: 1, max: 50, message: '地点最大长度不能超过50个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入文本', trigger: 'blur'},
            {min: 1, max: 500, message: '事项最大长度不能超过500个字符', trigger: 'blur'}
          ],
          remark: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        },
        time: [],
        tableData: [],
        loading: true,
        //查看通知
        lockVisible: false,
        lockFrom: {},
        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,
      }
    },
    mounted() {
      this.createNoList();
    },
    methods: {
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
          dateFrom: '',
          dateTo: '',
          pageSize: 10,
          pageNo: 1,
          type: ''
        }
        this.time = []
      },
      //通知详情
      lock(item) {
        this.lockFrom = item;
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
        this.queryForm.pageNo = 1;
        if (this.time && this.time !== '') {
          this.queryForm.dateFrom = this.time[0];
          this.queryForm.dateTo = this.time[1];
        }
        getNotification(this.queryForm).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            var arr = res.data.data.list;
            for (var i = 0; i < arr.length; i++) {
              arr[i].opAt = this.getMyDate(arr[i].opAt * 1000)
            }
            this.tableData = arr;
            this.total = res.data.data.totalCount;
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


      add() {
        this.addForm = {
          projectId: '',
          title: '',
          content: '',
          temp: '',
          remark: '',
        }
        this.imageUrl = '';
        this.exitVisible = true;
      },
      exitQX() {
        this.exitVisible = false;
        this.$refs['addForm'].resetFields();
      },
      exitQD() {
        var self = this;
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            this.exitVisible = false;
            createNotification(self.addForm).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(self,res);
                // self.$notify.success({
                //   title: '创建成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                self.createNoList();
              } else {
                myCallback.call(self,res);
                // self.$notify.error({
                //   title: '创建失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>
<style slop-scope>
  .box {
    /*min-width: 1000px;*/
    font-size: .14rem;
    color: #606266;
  }

  #add .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: .06rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  #add .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  #add .avatar-uploader-icon {
    font-size: .28rem;
    color: #8c939d;
    width: 1.78rem;
    height: 1.78rem;
    line-height: 1.78rem;
    text-align: center;
  }

  #add .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
<style>
  .box .el-textarea__inner {
    font-size: .12rem;
  }
</style>
