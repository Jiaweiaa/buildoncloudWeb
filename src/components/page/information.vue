<template>
  <div class="box">
    <!--创建通知-->
    <el-dialog :close-on-press-escape="false" id="add" @close="exitQX" top="50px" title="创建通知"
               :visible.sync="exitVisible" :close-on-click-modal="false">
      <el-form :model="addFrom" label-width="70px" :rules="addFormRules" ref="addFrom">
        <el-form-item label="资讯" prop="title">
          <el-input v-model="addFrom.title" placeholder="请输入资讯标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="padding-bottom: 10px;" class="ziXunStyle" label="资讯内容" prop="temp">
          <quill-editor ref="myTextEditor"
                        :options="editOption"
                        v-model="addFrom.temp">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="exitQX">取消</el-button>
        <el-button size="medium" type="primary" @click.native="exitQD">发布</el-button>
      </div>
    </el-dialog>
    <!--查看通知-->
    <el-dialog :close-on-press-escape="false" id="cock" top="50px" title="项目通知详情" :visible.sync="lockVisible"
               :close-on-click-modal="false">
      <el-form :model="lockFrom" label-width="110px" ref="lockFrom">
        <el-form-item label="资讯标题:">
          <p>{{lockFrom.title}}</p>
        </el-form-item>
        <el-form-item label="资讯内容:">
          <div class="lockFromStyleF" v-html="lockFrom.temp"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="lockVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" @click="add" size="medium" style="margin-bottom: 20px;">创建资讯</el-button>

    <div style="position: relative;">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item label="资讯标题">
          <el-input v-model="queryForm.title" size="small" placeholder="请输入资讯标题" auto-complete="off"></el-input>
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
        <el-button style="position: absolute;right: .9rem;top: .05rem;" size="small" @click="reset" icon="el-icon-refresh">
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
        label="资讯标题" align="center">
        <template scope="scope">
          <p @click="lock(scope.row)" style="color:#409EFF;cursor: pointer;">{{ scope.row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template scope="scope">
          <p>{{ scope.row.opat}}</p>
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
    newsList,
    getNewsList,
    detailsNewsList
  } from '../../api/api'
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      var temp = (rule, value, callback) => {
        if (this.addFrom.temp == '') {
          return callback(new Error('请输入资讯内容'));
        }
        callback();
      };
      return {
        editOption: {
          placeholder: ''
        },

        exitVisible: false,
        queryForm: {
          title: '',
          dateFrom: '',
          dateTo: '',
          pageSize: 10,
          pageNo: 1,
        },
        addFrom: {
          projectId: '',
          title: '',
          temp: '',
          remark: '',
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入资讯标题', trigger: 'blur'},
            {min: 1, max: 50, message: '通知标题最大长度不能超过50个字符', trigger: 'blur'}
          ],
          target: [
            {required: true, message: '请选择发送对象'}
          ],
          type: [
            {required: true, message: '请选择通知类型', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入文本', trigger: 'blur'}
          ],
          temp: [
            {required: true, validator: temp}
          ],
          remark: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        },
        //图片
        imageUrl: '',
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
        var parmass = {
          id: item.id
        }
        this.loading = true;
        detailsNewsList(parmass).then((res) => {
          this.lockFrom = res.data.data;
          this.loading = false;
          this.lockVisible = true;
        })

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
        if (this.time.length > 0) {
          this.queryForm.dateFrom = this.time[0];
          this.queryForm.dateTo = this.time[1];
        }
        this.queryForm.pageNo = 1;
        this.queryForm.type = this.queryForm.target;
        newsList(this.queryForm).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            var arr = res.data.data.list;
            for (var i = 0; i < arr.length; i++) {
              arr[i].opat = this.getMyDate(arr[i].opat * 1000)
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
        this.addFrom = {
          projectId: '',
          title: '',
          temp: '',
          remark: '',
        }
        this.imageUrl = '';
        this.exitVisible = true;
      },
      exitQX() {
        this.exitVisible = false;
        this.$refs['addFrom'].resetFields();
      },
      exitQD() {
        this.$refs['addFrom'].validate((valid) => {
          if (valid) {
            if (this.addFrom.temp.length > 3800000) {
              this.$notify({
                title: '警告',
                message: '资讯内容过长,请重试！',
                type: 'warning'
              });
            } else {
              this.exitVisible = false;
              this.loading = true;
              getNewsList(this.addFrom).then((res) => {
                if (res.data.code == 0) {
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '创建成功',
                  //   // message: res.data.msg,
                  //   // offset: 100
                  // });
                  this.createNoList();
                  this.loading = false;
                } else {
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '创建失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              });
            }
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
    font-size: 28px;
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

  .lockFromStyleF img {
    max-width: 100%;
  }
</style>
<style>
  .ziXunStyle .el-form-item__error {
    top: 100%;
    z-index: 999;
  }

  .box .ql-picker-label {
    line-height: .24rem;
  }

  .box .ql-snow .ql-picker.ql-expanded .ql-picker-options {
    margin-top: .05rem;
  }
</style>
