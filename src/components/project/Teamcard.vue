<template>
  <div class="teamCart">
    <!--班组考勤-->
    <el-dialog top="50px" title="班组考勤详情" :visible.sync="steamVisible" :before-close="teamCencel"
               :close-on-press-escape="false" width="70%" :close-on-click-modal="false" class="delHeight">
      <ul style="overflow: hidden;line-height: .4rem;">
        <li style="float: left;width: 33%;">
          <p style="float: left;width:1rem;">项目名称：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.projectName}}</p>
        </li>
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:1rem;">劳务公司：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.laborName}}</p>
        </li>
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:1rem;">班组名称：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.teamName}}</p>
        </li>
      </ul>
      <div style="overflow: hidden;line-height: .4rem;">
        <span style="display: inline-block; width: 1rem;">日期范围:</span><span style="padding-left: .1rem;">{{timeOld[0]}}至{{timeOld[1]}}</span>
      </div>
      <ul style="width: 5rem;overflow: hidden;line-height: .4rem;">
        <li style="float: left;width: 33%;">
          <p style="float: left;width:1rem;">出勤人数：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.attendanceNum}}</p>
        </li>
        <!--<li style="float: left;width: 33%;">-->
        <!--<p style="float: left;text-align: right;width:100px;">迟到人次：</p>-->
        <!--<p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.lateTimes}}</p>-->
        <!--</li>-->
        <!--<li style="float: left;width: 33%;">-->
        <!--<p style="float: left;text-align: right;width:100px;">早退人次：</p>-->
        <!--<p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.tardyTimes}}</p>-->
        <!--</li>-->
      </ul>
      <el-table
        stripe
        v-if="teamtableData.length!=0"
        :data="teamtableData"
        style="width: 100%"
        v-loading="teamLoading"
        element-loading-text="拼命加载中"
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
        <el-table-column align="center" v-for="(item,index) in teamtableData[0].records" :label="item.recordDT">
          <el-table-column
            label="打卡时间"
            width="120" align="center">
            <template scope="scope">
              <div>
                <p v-for="item2 in teamtableData[scope.$index].records[index].newData">{{item2}}</p>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div v-else="teamtableData.length!=0" style="text-align: center;">
        <i class="el-icon-loading"></i> 正在加载中...
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="position: absolute; right: .2rem; top: 1.3rem;" type="primary" size="small" @click="getExcel">
          导出Excel
        </el-button>
        <el-button size="small" @click.native="teamCencel">取消</el-button>
      </div>
    </el-dialog>
    <div style="width: 4.6rem;overflow: hidden;padding-bottom: .1rem;">
      <p style="float: left;text-align: right;">项目名称：</p>
      <p style="float: left">{{formProject.name}}</p>
    </div>
    <div style="overflow: hidden;line-height: .42rem;">
      <div style="width: 3rem;float: left;">
        <p style="float: left;text-align: right;">班组名称：</p>
        <p style="width: 2rem;float: left">
          <el-select
            v-model="queryFrom.teamId"
            filterable
            remote
            clearable
            style="width: 2rem;"
            size="small"
            @change="setname"
            @focus="removeReadOnly($event)"
            reserve-keyword
            placeholder="班组名称或联系方式"
            @blur="toFalse"
            :loading-text="workerTeamOptionloadingText"
            :remote-method="getList2" :loading="workerTeamOptionloading">
            <el-option
              v-for="item in workerTeamOption"
              :key="item.id"
              :label="item.workteamname"
              :value="item.id">
              <span style="float: left">{{ item.workteamname }}</span>
              <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.teamleadertel }}</span>
            </el-option>
          </el-select>
        </p>
      </div>
      <div style="width: 3rem;float: left;">
        <p style="float: left;text-align: right;">劳务公司：</p>
        <p style="width: 2rem;float: left">
          <el-select
            v-if="laowuShow"
            v-model="queryFrom.laborId"
            filterable
            remote
            style="width: 2rem;"
            size="small"
            reserve-keyword
            :loading-text="projectCommissionerloadingText"
            @blur="toFalse"
            placeholder="劳务公司名称或联系方式"
            @focus="removeReadOnly($event)"
            :remote-method="getList" :loading="projectCommissionerloading">
            <el-option
              v-for="item in laborServiceCompanyOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.contactTel }}</span>
            </el-option>
          </el-select>
          <span style="color: #606266;font-size: .13rem;">{{laowuName}}</span></p>
      </div>
      <br>
      <div style="overflow: hidden;position: relative;width: 100%;">
        <p style="float: left;text-align: right;">日期范围：</p>
        <p style="width: 4rem;float: left;padding-bottom: .1rem;">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            size="small"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </p>
        <el-button size="small" style="position: absolute;right: .1rem;top: 1px;" type="primary" icon="el-icon-search"
                   @click="getTeamCount">搜索
        </el-button>
        <el-button size="small" style="position: absolute;right: 1.1rem;top: .01rem;" @click="reset" icon="el-icon-refresh">
          重置
        </el-button>
      </div>
    </div>
    <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              show-summary
              :summary-method="getSummaries"
              style="width: 100%">
      <el-table-column label="班组" align="center">
        <template scope="scope">
          <p @click="see(scope.row)" class="workteamname">{{ scope.row.teamName}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="劳务公司">
        <template scope="scope">
          <p>{{ scope.row.laborName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="出勤人数" align="center" prop="attendanceNum">
        <template scope="scope">
          <p>{{ scope.row.attendanceNum}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="迟到人数" align="center"  prop="lateTimes">-->
      <!--<template scope="scope">-->
      <!--<p>{{ scope.row.lateTimes}}</p>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--label="早退人次" align="center" prop="tardyTimes">-->
      <!--<template scope="scope">-->
      <!--<p>{{ scope.row.tardyTimes }}</p>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
    queryWorkerTeamByProjectAndKey,
    getTeamCount,
    teamWorkerTail,

  } from '../../api/projectapi'
  import {
    getLaborList
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
    data() {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      return {
        workerTeamOptionloadingText: '班组名称或班组长联系方式',
        projectCommissionerloadingText: '请输入劳务公司名称或联系方式',
        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        loading: false,
        time: [this.getCurrentMonthFirst().Format("yyyy-MM-dd"), this.getCurrentMonthLast().Format("yyyy-MM-dd")],
        //查询时的time
        timeOld: [],
        teamLoading: true,
        queryFrom: {
          projectId: this.formProject.id,
          laborId: '',
          teamId: '',
          begin: '',
          end: '',
          pageSize: 10,
          pageNO: 1
        },
        workerTeamOptionloading: false,
        projectCommissionerloading: false,
        //班组列表
        workerTeamOption: [],
        laborServiceCompanyOption: [],
        laowuShow: true,
        laowuName: '',
        tableData: [],
        //班组详细考勤
        teamtableData: [],
        steamMsg: {},
        steamVisible: false,
      }
    },
    created() {
      this.getTeamCount();
    },
    methods: {
      teamCencel() {
        this.steamVisible = false;
        this.teamLoading = true;
      },
      // 合计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => item[column.property]);
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },

      toFalse() {
        this.projectCommissionerloadingText = '请输入劳务公司名称或联系方式';
        this.workerTeamOptionloadingText = '班组名称或班组长联系方式';
      },
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      getCurrentMonthFirst() {
        var date = new Date();
        date.setDate(1);
        return date;
      },
      getCurrentMonthLast() {
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        return new Date(nextMonthFirstDay - oneDay);
      },
      // 导出excel
      getExcel() {
        window.open('/workerman/check/teamWorkerTailExport?projectId=' + this.steamMsg.projectId + '&laborId=' + this.steamMsg.laborId + '&teamId=' + this.steamMsg.teamId + '&begin=' + this.timeOld[0] + '&end=' + this.timeOld[1] + '&attendanceNum=' + this.steamMsg.attendanceNum + '&lateTimes=' + this.steamMsg.lateTimes + '&tardyTimes=' + this.steamMsg.tardyTimes, '导出班组excel')
      },
      see(item) {
        this.steamMsg = item;
        this.teamtableData = [];
        var data = {
          projectId: item.projectId,
          laborId: item.laborId,
          teamId: item.teamId,
          workerId: '',
          begin: this.timeOld[0],
          end: this.timeOld[1],
        }
        this.steamVisible = true;
        this.teamLoading = false;
        teamWorkerTail(data).then((res) => {
          if (res.data.code == 0) {
            this.teamtableData = res.data.data;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryFrom.pageSize = val;
        this.getTeamCount();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryFrom.pageNO = val;
        this.getTeamCount();
      },
      //获取列表
      getTeamCount() {
        this.loading = true;
        if (this.time != null) {
          this.timeOld = this.time;
          this.queryFrom.begin = this.time[0];
          this.queryFrom.end = this.time[1];
        } else {
          this.queryFrom.begin = '';
          this.queryFrom.end = '';
        }
        getTeamCount(this.queryFrom).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {

            this.tableData = res.data.data.list;
            this.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //重置
      reset() {
        this.time = ["2017-12-01", "2017-12-31"];
        this.queryFrom = {
          projectId: this.formProject.id,
          laborId: '',
          teamId: '',
          begin: '',
          end: '',
          pageSize: 10,
          pageNO: 1
        }
      },
      // 获取班组列表
      getList2(query) {
        var self = this;
        this.workerTeamOptionloading = true;
        if (query == '') {
          self.workerTeamOption = []
          this.workerTeamOptionloadingText = '班组名称或班组长联系方式';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            self.workerTeamOption = [];
            this.workerTeamOptionloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            self.workerTeamOption = [];
            this.workerTeamOptionloadingText = '请最少输入5位';
            return;
          }
        }
        var data = {
          'search.key': query,
          'search.projectId': this.formProject.id
        }
        queryWorkerTeamByProjectAndKey(data).then((res) => {
          if (res.data.code == 0) {
            self.workerTeamOption = res.data.data;
            self.workerTeamOptionloading = false;
          } else {
            self.workerTeamOptionloading = false;
            myCallback.call(self,res)
            // self.$notify.error({
            //   title: '获取失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      //设置劳务公司
      setname() {
        this.tableData = [];
        if (this.queryFrom.teamId == '') {
          this.laowuShow = true;
          this.laowuName = '';
          this.queryFrom.laborId = '';
        } else {
          var arr = this.workerTeamOption;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == this.queryFrom.teamId) {
              if (arr[i].laborcompanyid) {
                this.laowuShow = false;
                this.laowuName = arr[i].laborcompanyname;
                this.queryFrom.laborId = arr[i].laborcompanyid;
              }
            }
          }
        }

      },
      // 获取劳务公司列表
      getList(query) {
        var self = this;
        self.projectCommissionerloading = true;
        if (query == '') {
          self.laborServiceCompanyOption = [];
          self.projectCommissionerloadingText = '请输入劳务公司名称或联系方式';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            self.laborServiceCompanyOption = [];
            self.projectCommissionerloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            self.laborServiceCompanyOption = [];
            self.projectCommissionerloadingText = '请最少输入5位';
            return;
          }
        }
        var data = {
          'search.nameorphoneKey': query,
          pageSize: 20
        }
        getLaborList(data).then((res) => {
          if (res.data.code == 0) {
            this.laborServiceCompanyOption = res.data.data.list;
            self.projectCommissionerloading = false;
          } else {
            self.projectCommissionerloading = false;
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
    },
  }
</script>
<style scoped>
  .teamCart {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    font-size: .12rem;
    color: #606266;
    padding-top: .2rem;
    padding-left: .2rem;
    padding-right: .2rem;
  }

  .red {
    color: red;
  }
</style>
<style>
  .delHeight .el-table .cell {
    height: auto;
  }
</style>
