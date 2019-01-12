<template>
  <div class="attendM">
    <!--
        搜索框
    -->
    <div class="searchBox">
      <div class="search" style="font-size: .13rem;">
        <p>班组长姓名：</p>
        {{this.thisData.name}}
      </div>
      <div class="search">
        <p>日期范围：</p>
        <el-date-picker
          size="small"
          v-model="dateBE"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <el-button class="searchBtn" style="right: 9%;" size="small" icon="el-icon-refresh" @click='clear'>重置</el-button>
      <el-button class="searchBtn" type="primary" size="small" icon="el-icon-search" @click='search'>搜索</el-button>
    </div>

    <!--
        列表
    -->
    <el-table
      class="table"
      :data="listData"
      :loading="loading"
      border
      style="width: 100%">
      <el-table-column
        label="项目"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.projectName ? scope.row.projectName  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="劳务公司"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.laborName ? scope.row.laborName  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出勤人数"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.attendanceNum ? scope.row.attendanceNum : ''}}</span>
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

    <!--班组考勤-->
    <el-dialog top="50px" title="班组考勤详情" :visible.sync="steamVisible" width="70%" :close-on-click-modal="false">
      <ul style="overflow: hidden;line-height: 40px; position: relative;">
        <li style="float: left;width: 30%;">
          <p style="float: left;width:100px;">项目名称：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.projectName}}</p>
        </li>
        <li style="float: left;width: 40%;">
          <p style="float: left;text-align: right;width:100px;">劳务公司：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.laborName}}</p>
        </li>
        <li style="float: left;width: 30%;">
          <p style="float: left;text-align: right;width:100px;">班组名称：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.teamName}}</p>
        </li>
      </ul>
      <div style="overflow: hidden;line-height: 40px;">
        日期范围:
        <span style="padding-left: 30px;">{{dateBE[0]}}至{{dateBE[1]}}</span>
      </div>
      <ul style="width: 500px;overflow: hidden;line-height: 40px;">
        <li style="float: left;width: 33%;">
          <p style="float: left;width:100px;">出勤人数：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.attendanceNum}}</p>
        </li>
        <el-button style="position: absolute; right: 20px; top: 130px;" type="primary" size="small"
                   icon="el-icon-search" @click="getExcel">导出Excel
        </el-button>
      </ul>
      <el-table
        :loading="teamloading"
        class="attendTable"
        v-if="teamtableData.length!=0"
        :data="teamtableData"
        style="width: 100%"
        max-height="500">
        <el-table-column
          label="工友姓名"
          fixed
          width="100"
          align="center">
          <template scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in teamtableData[0].records" :label="item.recordDT" align="center">
          <el-table-column
            label="打卡时间"
            width="120">
            <template scope="scope">
              <div>
                <p v-for="item2 in teamtableData[scope.$index].records[index].newData">{{item2}}</p>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelBtnClick">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getTeamList, teamWorkerTail} from '../../api/api'
  import myCallback from "../../../static/common/callback"

  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      return {
        teamloading: true,
        dateBE: [],
        thisData: {
          name: '',
          id: ''
        },
        nowData: '',

        // 页面
        listData: [],
        currentPage: 1,
        listDataLab: [],
        totalNum: 0,
        pageSize: 10,
        loading: true,

        thisNowPage: 1,

        //班组详细考勤
        teamtableData: [],
        steamMsg: {},
        steamVisible: false
      }
    },
    created() {
      window.localStorage.setItem('typeOfPage', 1);
      this.thisData.name = this.$route.query.name;
      this.thisData.id = this.$route.query.id;
      this.getNowFormatDate();
      this.dateBE[0] = this.nowData;
      this.dateBE[1] = this.nowData;

      var parmas = {
        teamId: this.thisData.id,
        begin: this.nowData,
        end: this.nowData,
        pageNo: this.thisNowPage,
        pageSize: this.pageSize
      }
      this.getList(parmas)
    },
    methods: {
      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },

      // 获取当前时间
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        this.nowData = currentdate;
      },

      // 获取列表
      getList(parmas) {
        getTeamList(parmas).then((res) => {
          this.listData = res.data.data.list;
          this.loading = false;
          this.currentPage = res.data.data.pageNo;
          this.totalNum = res.data.data.totalCount;
        })
      },
      clear() {
        this.dateBE = [];
        this.dateBE[0] = this.nowData;
        this.dateBE[1] = this.nowData;
      },
      search() {
        this.thisNowPage = 1;
        var parmas = {
          teamId: this.thisData.id,
          begin: this.dateBE[0],
          end: this.dateBE[1],
          pageNo: this.thisNowPage,
          pageSize: this.pageSize
        }
        this.loading = true;
        this.getList(parmas)
      },
      handleCurrentChange(val) {
        this.thisNowPage = val;
        var parmas = {
          teamId: this.thisData.id,
          begin: this.dateBE[0],
          end: this.dateBE[1],
          pageNo: this.thisNowPage,
          pageSize: this.pageSize
        }
        this.getList(parmas)
      },
      handleSizeChange(val) {
        this.pageSize = val;
        var parmas = {
          teamId: this.thisData.id,
          begin: this.dateBE[0],
          end: this.dateBE[1],
          pageNo: this.thisNowPage,
          pageSize: this.pageSize
        }
        this.getList(parmas)
      },

      cancelBtnClick() {
        this.steamVisible = false;
      },
      // 查看
      lookThis(item) {
        this.steamMsg = item;
        var data = {
          projectId: item.projectId,
          laborId: item.laborId,
          teamId: item.teamId,
          workerId: '',
          begin: this.dateBE[0],
          end: this.dateBE[1]
        }
        this.steamVisible = true;

        teamWorkerTail(data).then((res) => {
          if (res.data.code == 0) {
            this.teamtableData = res.data.data;
            this.teamloading = false;
          } else {
            this.teamloading = false;
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },

      // 导出excel
      getExcel() {
        window.open('/workerman/check/teamWorkerTailExport?projectId=' + this.steamMsg.projectId + '&laborId=' + this.steamMsg.laborId + '&teamId=' + this.steamMsg.teamId + '&begin=' + this.dateBE[0] + '&end=' + this.dateBE[1] + '&attendanceNum=' + this.steamMsg.attendanceNum + '&lateTimes=' + this.steamMsg.lateTimes + '&tardyTimes=' + this.steamMsg.tardyTimes, '导出班组excel')
      }
    }
  }
</script>
<style slop-scope>
  .attendM {
    font-size: .14rem;
  }

  .attendM .searchBox {
    width: 100%;
    margin-bottom: .15rem;
    /*min-width: 1150px;*/
    float: left;
    overflow: hidden;
    position: relative;
    height: 1rem;
  }

  .attendM .search {
    height: 50px;
    line-height: 50px;
    margin-right: 15px;
    width: 100% !important;
  }

  .attendM .search p {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
  }

  .attendM .search .searchInput {
    float: left;
    width: 180px;
  }

  .attendM .searchBtn {
    position: absolute;
    bottom: 5%;
    right: 2%;
  }

  .attendM .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }

  .attendM .el-dialog__body {
    padding: 15px 20px 20px 20px !important;
  }

  .attendM .el-table .cell {
    height: 100%;
    text-align: center;
  }

  .attendM .red {
    color: red;
  }
</style>
