<template>
  <div class="workerAttend">
    <!--
        搜索框
    -->
    <div class="searchBox">
      <div class="search" style="font-size: 13px;">
        <p>工友姓名：</p>
        {{this.thisData.name}}
      </div>
      <div class="search" style="font-size: 13px;">
        <p>联系方式：</p>
        {{this.thisData.tel}}
      </div>
      <div class="search" style="font-size: 13px;">
        <p>身份证号：</p>
        {{this.thisData.idCard}}
      </div>
      <div class="search">
        <p>日期范围：</p>
        <el-date-picker
          style="float: left;"
          size="small"
          v-model="beginData"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
        <p style="width: 20px; margin: 0 20px;">至</p>
        <el-date-picker
          v-model="endData"
          type="month"
          size="small"
          value-format="yyyy-MM"
          placeholder="选择月">
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
      :span-method="objectSpanMethod"
      border
      :loading="loading"
      style="min-width: 1100px">
      <el-table-column
        label="月份"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.yearMonth ? scope.row.yearMonth  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目"
        min-width="15%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.projectName ? scope.row.projectName  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="班组"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.teamName ? scope.row.teamName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="劳务公司"
        min-width="15%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.laborName ? scope.row.laborName  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出勤天数"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.attendanceDays ? scope.row.attendanceDays  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="迟到次数"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.lateTimes ? scope.row.lateTimes  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="早退次数"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.tardyTimes ? scope.row.tardyTimes  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="总工时"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.totalWorkingTime ? scope.row.totalWorkingTime  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="迟到早退总时间"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.lateTotalTime ? scope.row.lateTotalTime  : ''}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--
        查看
    -->
    <el-dialog :close-on-press-escape="false" top="50px" title="工友考勤详情" :visible.sync="steamVisible" width="70%"
               :close-on-click-modal="false">
      <ul style="overflow: hidden;line-height: 40px;">
        <li style="float: left;width: 33%;">
          <p style="float: left;width:100px;">工友姓名：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.workerName}}</p>
        </li>
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:100px;">月份：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.yearMonth}}</p>
        </li>

      </ul>
      <ul style="overflow: hidden;line-height: 40px;">
        <li style="float: left;width: 15%;">
          <p style="float: left;width:80px;">出勤天数：</p>
          <p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.attendanceDays}}</p>
        </li>
        <li style="float: left;width: 17.5%;">
          <p style="float: left;text-align: right;width:80px;">迟到次数：</p>
          <p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.lateTimes}}</p>
        </li>
        <li style="float: left;width: 15%;">
          <p style="float: left;text-align: right;width:80px;">早退次数：</p>
          <p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.tardyTimes}}</p>
        </li>
        <li style="float: left;width: 15%;">
          <p style="float: left;text-align: right;width:85px;">工作总工时：</p>
          <p style="float: left;width:calc(100% - 95px);padding-left: 10px;">{{steamMsg.totalWorkingTime}}</p>
        </li>
        <li style="float: left;width: 30%;">
          <p style="float: left;text-align: right;width:120px;">迟到早退总工时：</p>
          <p style="float: left;width:calc(100% - 130px);padding-left: 10px;">{{steamMsg.lateTotalTime}}</p>
        </li>
        <el-button style="position: absolute; right: 20px; top: 100px;" type="primary" size="small"
                   icon="el-icon-search" @click="getExcel">导出Excel
        </el-button>
      </ul>
      <el-table
        :data="worktableData"
        border
        style="width: 100%">
        <el-table-column label="日期" align="center">
          <template scope="scope">
            <p>{{ scope.row.recordDT}}</p>
          </template>
        </el-table-column>
        <el-table-column label="班组" align="center">
          <template scope="scope">
            <p>{{ scope.row.teamName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="劳务公司">
          <template scope="scope">
            <p>{{ scope.row.laborName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="进场时间" align="center">
          <template scope="scope">
            <p :class="{'red':contains(scope.row.abnormal
, item)}" v-for="item in scope.row.in">{{item }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="出场时间" align="center">
          <template scope="scope">
            <p :class="{'red':contains(scope.row.abnormal
, item)}" v-for="item in scope.row.out">{{item }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="工时" align="center">
          <template scope="scope">
            <p>{{ scope.row.workingHours }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="steamVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {WorkerKqList, teamWorkerTail, addWorker} from '../../api/api'
  import {workerTail} from '../../api/projectapi'
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      return {

        beginData: '',
        endData: '',
        thisData: [],
        nowData: '',
        // 页面
        listData: [],
        loading: true,

        thisNowPage: 1,

        //班组详细考勤
        worktableData: [],
        steamMsg: {},
        steamVisible: false
      }
    },
    created() {
      window.localStorage.setItem('typeOfPagea', 1);
      this.thisData.name = this.$route.query.name;
      this.thisData.id = this.$route.query.id;
      this.thisData.tel = this.$route.query.tel;
      this.thisData.idCard = this.$route.query.idCard;
      this.getNowFormatDate();
      this.beginData = this.nowData;
      this.endData = this.nowData;

      var parmas = {
        workerId: this.thisData.id,
        begin: this.beginData,
        end: this.endData
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
        var currentdate = year + seperator1 + month;
        this.nowData = currentdate;
      },

      // 获取列表
      getList(parmas) {
        WorkerKqList(parmas).then((res) => {
          if (!res) {
            return;
          }
          this.listData = res.data.data;
          this.loading = false;
        })
      },
      clear() {
        this.dateBE = [];
        this.dateBE[0] = this.nowData;
        this.dateBE[1] = this.nowData;
      },
      search() {
        var parmas = {
          workerId: this.thisData.id,
          begin: this.beginData,
          end: this.endData
        }
        this.loading = true;
        this.getList(parmas)
      },
      handleCurrentChange(val) {
        this.thisNowPage = val;
        var parmas = {
          workerId: this.thisData.id,
          begin: this.beginData,
          end: this.endData
        }
        this.getList(parmas)
      },
      handleSizeChange(val) {
        this.pageSize = val;
        var parmas = {
          workerId: this.thisData.id,
          begin: this.beginData,
          end: this.endData
        }
        this.getList(parmas)
      },
      // 查看
      lookThis(item) {
        this.steamMsg = item;
        var data = {
          projectId: item.projectId,
          laborId: item.laborId,
          teamId: item.teamId,
          workerId: item.workerId,
          yyyymm: item.yearMonth + '-01',
        }
        this.steamVisible = true;
        this.teamloading = true;
        workerTail(data).then((res) => {
          if (res.data.code == 0) {
            var tabledata = [];
            var arr = res.data.data;
            for (var i = 0; i < arr.length; i++) {
              var json = {
                recordDT: '',
                teamName: '',
                laborName: '',
                in: [],
                out: [],
                workingHours: '',
                abnormal: []
              }
              json.recordDT = arr[i].recordDT;
              json.teamName = arr[i].teamName;
              json.laborName = arr[i].laborName;
              json.workingHours = arr[i].workingHours;
              var arr4 = eval('(' + arr[i].unusualRecords + ')');
              if (arr4) {
                for (var m = 0; m < arr4.length; m++) {
                  json.abnormal.push(arr4[m].clock)
                }
              } else {
                json.abnormal = [];
              }
              if (arr[i].recordExtends) {
                var arr2 = arr[i].recordExtends;
                for (var f = 0; f < arr2.length; f++) {
                  if (arr2[f].type == 'in') {
                    json.in.push(arr2[f].checkPoint)
                  }
                  if (arr2[f].type == 'out') {
                    json.out.push(arr2[f].checkPoint)
                  }
                }
              }
              tabledata.push(json)
            }
            this.worktableData = tabledata;
            this.teamloading = false;
          } else {
            this.teamloading = false;
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      cancelBtnClick() {
        this.steamVisible = false;
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        //console.log(row, column, rowIndex, columnIndex);
      },
      getExcel() {
        window.open('/workerman/check/workerTailExport?yyyymm=' + this.steamMsg.yearMonth + '-01&projectId=' + this.steamMsg.projectId + '&laborId=' + this.steamMsg.laborId + '&teamId=' + this.steamMsg.teamId + '&workerId=' + this.steamMsg.workerId + '&attendanceNum=' + this.steamMsg.attendanceDays + '&lateTimes=' + this.steamMsg.lateTimes + '&tardyTimes=' + this.steamMsg.tardyTimes + '&lateHours=' + this.steamMsg.lateTotalTime + '&name=' + this.steamMsg.workerName, '导出工友xcel');
      }
    }
  }
</script>
<style>
  .workerAttend {
    font-size: 14px;
  }

  .workerAttend .searchBox {
    width: 100%;
    margin-bottom: 15px;
    min-width: 1150px;
    float: left;
    overflow: hidden;
    position: relative;
    height: 200px;
  }

  .workerAttend .search {
    height: 50px;
    width: 100% !important;
    line-height: 50px;
    margin-right: 15px;
    float: left;
  }

  .workerAttend .search p {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
  }

  .workerAttend .search .searchInput {
    float: left;
    width: 180px;
  }

  .workerAttend .searchBtn {
    position: absolute;
    bottom: 5%;
    right: 2%;
  }

  .workerAttend .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }

  .workerAttend .red {
    color: red;
  }

  .workerAttend .el-table .cell {
    height: 100%;
  }
</style>
