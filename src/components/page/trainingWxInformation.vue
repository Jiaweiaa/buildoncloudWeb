<template>
  <div class="tranWx">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">同步培训信息</el-button>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>课程名称：</p>
        <el-input
          placeholder="请输入课程名称"
          size="small"
          class="searchInput"
          v-model="search_name">
        </el-input>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
        页面列表
    -->
    <el-table
      class="tableList"
      :data="listData"
      :loading="loading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        label="课程名称"
        height="100"
        align="center">
        <template scope="scope">
                    <span @click="show(scope.row.url)"
                          style="color: #409EFF; display: block; cursor: pointer; position:absolute; width: 100px; height: 100px; left: 50%; top: 5px; margin-left: -50px;">
                        <img style="height: 100%; display: block;"
                             :src="'data:image/jpeg;base64,'+scope.row.thumb_media_base64"/></span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.create_time ? scope.row.create_time : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="registration(scope.row)">报名情况
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
        查看
    -->
    <el-dialog :close-on-press-escape="false" title="培训讯息" :visible.sync="showVisible" :close-on-click-modal="false">
      <p style="font-size: 16px;">二维码预览</p>
      <qrcode style="width: 200px; position: relative; left: 50%; margin-left: -100px; margin-top: 20px;" :value="src"
              :options="{ size: 200 }"></qrcode>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        报名情况
    -->
    <el-dialog :close-on-press-escape="false" title="报名情况" :visible.sync="projectVisible"
               :before-close="lookCanclByThis" :close-on-click-modal="false">
      <div slot="footer" class="dialog-footer">
        <template>
          <el-table
            :data="proJectListData"
            border
            style="width: 100%; margin-bottom: 20px;">
            <el-table-column
              label="联系人姓名"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.name ? scope.row.name : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="联系人方式"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.mobile ? scope.row.mobile : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="性别"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.sex ? '女' : '男'}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="年龄"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.age ? scope.row.age : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="报名时间"
              v-show="isTopAdmin"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.opAt ? scope.row.opAt : ''}} </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="prohandleSizeChange"
            @current-change="prohandleCurrentChange"
            :current-page.sync="procurrentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="projectSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="prototalNum">
          </el-pagination>
        </template>
        <div slot="footer" class="dialog-footer" style="margin-top: 20px">
          <el-button size="small" @click.native="lookCanclByThis">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    asyncGetTrainMaterialInfo,
    wxInformationList,
    wxInformationDetalis
  } from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      var parmas = {
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        name: this.search_name
      }
      this.getList(parmas);
    },
    data() {
      return {
        // 课程名称
        search_name: '',

        // 报名情况
        projectVisible: false,
        proJectListData: [],
        projectId: '',
        projectSize: 10,
        projectNo: 1,
        prototalNum: 0,
        procurrentPage: 0,

        // 查看开关
        showVisible: false,

        // searching 开关
        loading: false,

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,
        pageNum: 1,
        src: '',
        isTopAdmin: false,
        adminData: []
      }
    },
    methods: {
      //获取登陆信息
      getAdminData() {
        getAdmin().then((res) => {
          if (!res) {
            return;
          }
          this.adminData = res.data.data;
          for (var i = 0; i < this.adminData.roles.length; i++) {
            if (this.adminData.roles[i].code == "HEAD_OFFICE_ADMIN") {
              this.isTopAdmin = true;
            }
          }
        })
      },

      lookCanclByThis() {
        this.projectVisible = false;
        this.proJectListData = [];
      },
      prohandleCurrentChange(val) {
        this.projectNo = val;
        var parmas = {
          trainMaterialInfoId: this.projectId,
          pageSize: this.projectSize,
          pageNo: this.projectNo
        }
        wxInformationDetalis(parmas).then((res) => {
          this.proJectListData = res.data.data.list;
          this.procurrentPage = res.data.data.pageNo;
          this.prototalNum = res.data.data.totalCount;
          for (var i = 0; i < this.proJectListData.length; i++) {
            this.proJectListData[i].opAt = this.getMyDate(this.proJectListData[i].opAt * 1000).substr(0, 10)
          }
        })
      },
      prohandleSizeChange(val) {
        this.projectSize = val;
        var parmas = {
          trainMaterialInfoId: this.projectId,
          pageSize: this.projectSize,
          pageNo: this.projectNo
        }
        wxInformationDetalis(parmas).then((res) => {
          this.proJectListData = res.data.data.list;
          this.procurrentPage = res.data.data.pageNo;
          this.prototalNum = res.data.data.totalCount;
          for (var i = 0; i < this.proJectListData.length; i++) {
            this.proJectListData[i].opAt = this.getMyDate(this.proJectListData[i].opAt * 1000).substr(0, 10)
          }
        })
      },
      // 报名情况
      registration(item) {
        this.projectId = item.id;
        this.projectVisible = true;
        var parmas = {
          trainMaterialInfoId: this.projectId,
          pageSize: this.projectSize,
          pageNo: this.projectNo
        }
        wxInformationDetalis(parmas).then((res) => {
          this.proJectListData = res.data.data.list;
          this.procurrentPage = res.data.data.pageNo;
          this.prototalNum = res.data.data.totalCount;
          for (var i = 0; i < this.proJectListData.length; i++) {
            this.proJectListData[i].opAt = this.getMyDate(this.proJectListData[i].opAt * 1000).substr(0, 10)
          }
        })
      },

      getList(parmas) {
        wxInformationList(parmas).then((res) => {
          this.listData = res.data.data.list;
          for (var i = 0; i < this.listData.length; i++) {
            this.listData[i].create_time = this.getMyDate(this.listData[i].create_time * 1000).substr(0, 10)
          }
          this.currentPage = res.data.data.pageNo;
          this.totalNum = res.data.data.totalCount;
        })
      },
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

      // 同步信息
      clickAdd() {
        asyncGetTrainMaterialInfo().then((res) => {
          if (res.data.code == '0') {
            myCallback.call(this,res);
            // this.$notify.success({
            //   title: '同步成功',
            //   // message: res.data.msg,
            //   // offset: 100
            // });
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '同步失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 搜索
      search() {
        this.pageNum = 1;
        var parmas = {
          pageNo: this.pageNum,
          pageSize: this.pageSize,
          name: this.search_name
        }
        this.getList(parmas);
      },
      // 清空
      clear() {
        this.search_name = '';
      },
      // 页数更改
      handleCurrentChange(val) {
        this.pageNum = val;
        var parmas = {
          pageNo: this.pageNum,
          pageSize: this.pageSize,
          name: this.search_name
        }
        this.getList(parmas);
      },
      // 条数更改
      handleSizeChange(val) {
        this.pageSize = val;
        var parmas = {
          pageNo: this.pageNum,
          pageSize: this.pageSize,
          name: this.search_name
        }
        this.getList(parmas);
      },

      // 查看
      show(item) {
        this.src = item;
        this.showVisible = true;
      },
      ok() {
        this.showVisible = false;
      }
    }
  }
</script>
<style>
  .tranWx {
    font-size: 0rem;
  }
  .tranWx .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .tranWx .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .tranWx .searchBox {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: .15rem;
  }

  .tranWx .search {
    width: 3rem;
    height: .5rem;
    line-height: .5rem;
    float: left;
  }

  .tranWx .search p {
    float: left;
    width: .7rem;
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .tranWx .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .tranWx .searchBtn {
    position: absolute;
    right: 0;
    top: .1rem;
  }

  .tranWx .tableList .el-table__row {
    height: 1.1rem;
  }
</style>
