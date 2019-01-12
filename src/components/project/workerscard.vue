<template>
  <div class="workerscard">
    <!--工友补考勤-->
    <el-dialog top="50px" title="工友补考勤" :visible.sync="workVisible" width="70%" :close-on-click-modal="false"
               :close-on-press-escape="false" :before-close="bukaQX">
      <div>
        <span style="display: inline-block;width: 1rem;text-align: right;line-height: .4rem;">考勤日期</span>
        <span style="display: inline-block;width: 3rem;text-align: right;line-height: .4rem;">
                    <el-date-picker
                      v-model="correctPreFrom.recordDT"
                      type="date"
                      size="small"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      @change="ccc"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                </span>
      </div>
      <div v-if="datashow" style="width: 6rem;margin: 0 auto;line-height: .4rem;">
        <el-row style="border-bottom: 1px solid #ccc;">
          <el-col :span="8">
            <div class="grid-content bg-purple">标准上工时间</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">实际上工时间</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">上午上工时间</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{timeFrom.morningStart}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">上午上工时间</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
                            <span v-if="data.amOn">
                                <span v-if="contains(data.unusualRecords, data.amOn)">
                                    <span :class="{'red':contains(data.unusualRecords, data.amOn)}">{{data.amOn}}</span>
                                    <span style="padding-left: .1rem">
                                        <el-time-picker size="small" style="width: 1.5rem;"
                                                        v-model="timedata[0].correntTime"
                                                        placeholder="请选择"></el-time-picker>
                                    </span>
                                </span>
                                <span v-else="contains(data.unusualRecords, data.amOn)">
                                    <span>{{data.amOn}}</span>
                                </span>
                            </span>
              <span v-else="data.amOn">
                                <el-time-picker size="small" style="width: 1.5rem;" v-model="timedata[0].correntTime"
                                                placeholder="请选择"></el-time-picker>
                            </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">上午下工时间</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{timeFrom.morningEnd}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">上午下工时间</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
                        <span v-if="data.amOff">
                            <span v-if="contains(data.unusualRecords, data.amOff)">
                                <span :class="{'red':contains(data.unusualRecords, data.amOff)}">{{data.amOff}}</span>
                                <span style="padding-left: .1rem">
                                        <el-time-picker size="small" style="width: 1.5rem;"
                                                        v-model="timedata[1].correntTime"
                                                        placeholder="请选择"></el-time-picker>
                                    </span>
                            </span>
                            <span v-else="contains(data.unusualRecords, data.amOff)">
                                <span>{{data.amOff}}</span>
                            </span>
                        </span>
              <span v-else="data.amOff">
                            <el-time-picker size="small" style="width: 1.5rem;"
                                            v-model="timedata[1].correntTime"

                                            placeholder="请选择">
  </el-time-picker>
                        </span></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">下午上工时间</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{timeFrom.afternoonStart}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">下午上工时间
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
                        <span v-if="data.pmOn">
                            <span v-if="contains(data.unusualRecords, data.pmOn)">
                                <span :class="{'red':contains(data.unusualRecords, data.pmOn)}">{{data.pmOn}}</span>
                                <span style="padding-left: .1rem">
                                    <el-time-picker size="small" style="width: 1.5rem;"
                                                    v-model="timedata[2].correntTime"
                                                    placeholder="请选择">
                                    </el-time-picker>
                                </span>
                            </span>
                            <span v-else="contains(data.unusualRecords, data.pmOn)">
                                <span>{{data.pmOn}}</span>
                            </span>
                        </span>
                        <span v-else="data.pmOn">
                            <el-time-picker size="small" style="width: 1.5rem;"
                                            v-model="timedata[2].correntTime"
                                            placeholder="请选择">
                            </el-time-picker>
                        </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">下午下工时间</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{timeFrom.afternoonEnd}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">下午下工时间
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
                        <span v-if="data.pmOff">
                            <span v-if="contains(data.unusualRecords, data.pmOff)">
                                <span :class="{'red':contains(data.unusualRecords, data.pmOff)}">{{data.pmOff}}</span>
                                <span style="padding-left: .1rem">
                                    <el-time-picker size="small" style="width: 1.5rem;"
                                                    v-model="timedata[3].correntTime"
                                                    placeholder="请选择"></el-time-picker>
                                </span>
                            </span>
                            <span v-else="contains(data.unusualRecords, data.pmOff)">
                                <span>{{data.pmOff}}</span>
                            </span></span>
              <span v-else="data.pmOff">
                            <el-time-picker size="small" style="width: 1.5rem;"
                                            v-model="timedata[3].correntTime"

                                            placeholder="请选择">
  </el-time-picker>
                        </span>

            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="bukaQX">取消</el-button>
        <el-button size="small" type="primary" @click="buka">确 定</el-button>
      </div>
    </el-dialog>
    <!--工友考勤-->
    <el-dialog top="50px" title="工友考勤详情" :visible.sync="steamVisible" width="70%" :close-on-click-modal="false"
               :close-on-press-escape="false" class="delHeight">
      <ul style="overflow: hidden;line-height: .4rem;">
        <li style="float: left;width: 1.64rem;">
          <p style="float: left;width:.62rem;">工友姓名：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.workerName}}</p>
        </li>
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:.62rem;">月份：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.yearMonth}}</p>
        </li>
      </ul>
      <ul style="overflow: hidden;line-height: .4rem;">
        <li style="float: left;width: 17.5%;">
          <p style="float: left;width:.62rem;">出勤天数：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.attendanceDays}}</p>
        </li>
        <!--<li style="float: left;width: 17.5%;">-->
        <!--<p style="float: left;text-align: right;width:100px;">迟到次数：</p>-->
        <!--<p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.lateTimes}}</p>-->
        <!--</li>-->
        <!--<li style="float: left;width: 17.5%;">-->
        <!--<p style="float: left;text-align: right;width:100px;">早退次数：</p>-->
        <!--<p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.tardyTimes}}</p>-->
        <!--</li>-->
        <li style="float: left;width: 17.5%;">
          <p style="float: left;text-align: right;width:1rem;">工作总工时：</p>
          <p style="float: left;width:calc(100% - 1.1rem);padding-left: .1rem;">{{steamMsg.totalWorkingTime}}</p>
        </li>
        <!--<li style="float: left;width: 30%;">-->
        <!--<p style="float: left;text-align: right;width:120px;">迟到早退总工时：</p>-->
        <!--<p style="float: left;width:calc(100% - 130px);padding-left: 10px;">{{steamMsg.lateTotalTime}}</p>-->
        <!--</li>-->
      </ul>
      <el-table
        stripe
        :data="worktableData"
        border
        v-loading="teamloading" element-loading-text="拼命加载中"
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
          label="打卡时间" align="center">
          <template scope="scope">
            <p v-for="item in scope.row.newData">{{item}}</p>
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
        <el-button type="primary" size="small" icon="el-icon-search" @click="getExcel">导出Excel</el-button>
        <el-button size="small" @click.native="steamVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    工友姓名:&nbsp;&nbsp;
    <el-select
      v-model="workerId"
      filterable
      remote
      clearable
      suffix-icon="el-icon-search"
      reserve-keyword
      placeholder="请输入姓名、身份证号"
      :remote-method="remoteMethod"
      @focus="removeReadOnly($event)"
      @change="workerIdChange"
      size="small"
      style="width: 2rem;display: inline-block;position: relative;float: none"
      :loading-text="workerloadingText"
      @blur="toFalse"
      :loading="workerloading">
      <el-option
        v-for="item in workerOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
        <span>{{ item.name }}</span>
        <span style="color: #8492a6; font-size: .13rem">{{ item.idCardNo }}</span>
      </el-option>
    </el-select>
    <div style="line-height: .42rem;" v-if="contentShow">
      <p><span>联系方式：</span>{{workerMsg.tel}}</p>
      <p><span>身份证号：</span>{{workerMsg.idCardNo}}</p>
      <div style="overflow: hidden;position: relative;padding-bottom: .1rem;">
        <p style="float: left">日期范围：</p>
        <p style="width: 5rem;float: left">
          <el-date-picker
            v-model="star"
            type="month"
            size="small"
            :picker-options="pickerOptions"
            placeholder="选择月">
          </el-date-picker>
          至
          <el-date-picker
            v-model="end"
            type="month"
            size="small"
            :picker-options="pickerOptions1"
            placeholder="选择月">
          </el-date-picker>
        </p>
        <el-button size="small" type="primary" icon="el-icon-search" @click="aaa">搜索</el-button>
        <el-button size="small" style="margin-left: .2rem;" @click="bbb" icon="el-icon-date" v-if="states!=2">补卡
        </el-button>
      </div>
      <el-table stripe v-if="tableDataShow" v-loading="loading" element-loading-text="拼命加载中"
                :data="tableData"
                border
                :span-method="arraySpanMethod"
                style="width: 100%">
        <el-table-column label="月份" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p @click="see(scope.row)" class="workteamname">{{ scope.row.yearMonth}}</p>
          </template>
        </el-table-column>
        <el-table-column label="班组" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.teamName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" :show-overflow-tooltip="true" label="劳务公司">
          <template scope="scope">
            <p>{{ scope.row.laborName}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="出勤天数" align="center">
          <template scope="scope">
            <p>{{ scope.row.attendanceDays}}</p>
          </template>
        </el-table-column>
        <!--<el-table-column  :show-overflow-tooltip="true"-->
        <!--label="迟到次数" align="center">-->
        <!--<template scope="scope">-->
        <!--<p>{{ scope.row.lateTimes}}</p>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column  :show-overflow-tooltip="true"-->
        <!--label="早退次数" align="center">-->
        <!--<template scope="scope">-->
        <!--<p>{{ scope.row.tardyTimes }}</p>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column :show-overflow-tooltip="true"
                         label="工作总工时" align="center">
          <template scope="scope">
            <p>{{ scope.row.totalWorkingTime }}</p>
          </template>
        </el-table-column>
        <!--<el-table-column  :show-overflow-tooltip="true"-->
        <!--label="迟到早退总工时" align="center">-->
        <!--<template scope="scope">-->
        <!--<p>{{ scope.row.lateTotalTime }}</p>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
  </div>
</template>
<script>
  import {
    getWorkerCount,
    workerTail,
    correctPre,
    correct,
    findManByProjectIdAndKey,
    getWorkTimeByProjectIdAndWorkerManId
  } from '../../api/projectapi'
  import {} from '../../api/api';
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
      return {
        teamloading: false,
        workerloadingText: '姓名、手机号、身份证号',
        steamVisible: false,
        search: '',
        workerId: '',
        workerloading: false,
        workerOptions: [],
        // 日期
        star: new Date(),
        end: new Date(),
        queryFrom: {
          projectId: this.formProject.id,
          workerId: '',
          begin: '',
          end: ''
        },
        pickerOptions: {
          disabledDate: (time) => {
            var N1 = this.end.getYear();
            var Y1 = this.end.getMonth();

            var N2 = time.getYear();
            var Y2 = time.getMonth();
            var number = (N1 - N2) * 12 + (Y1 - Y2)
            return number >= 36 || number < 0;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            const start = new Date();
            return time.getTime() > start.getTime();

          }

        },
        //列表loding
        loading: false,
        tableData: [],
        steamMsg: {},
        worktableData: [],
        workVisible: false,
        correctPreFrom: {
          projectId: this.formProject.id,
          workerId: '',
          recordDT: '',
        },

        //补卡列表
        data: {},
        //补卡列表显示
        datashow: false,
        timedata: [
          {
            field: '1',
            correntTime: ''
          },
          {
            field: '2',
            correntTime: ''
          },
          {
            field: '3',
            correntTime: ''
          },
          {
            field: '4',
            correntTime: ''
          }
        ],
//                补卡form

        bukaFrom: {
          projectId: this.formProject.id,
          teamId: '',
          workerId: '',
          laborId: '',
          data: '',
          date: ''
        },
        //详细显示
        contentShow: false,
        //考勤显示
        tableDataShow: false,

        //工友信息
        workerMsg: {},
        //标准时间from
        timeFrom: {}
      }
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
      toFalse() {
        this.workerloadingText = '姓名、手机号、身份证号';
      },
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      getExcel() {
        window.open('/workerman/check/workerTailExport?yyyymm=' + this.steamMsg.yearMonth + '-01&projectId=' + this.steamMsg.projectId + '&laborId=' + this.steamMsg.laborId + '&teamId=' + this.steamMsg.teamId + '&workerId=' + this.steamMsg.workerId + '&attendanceNum=' + this.steamMsg.attendanceDays + '&lateTimes=' + this.steamMsg.lateTimes + '&tardyTimes=' + this.steamMsg.tardyTimes + '&lateHours=' + this.steamMsg.lateTotalTime + '&name=' + this.steamMsg.workerName, '导出工友xcel');
      },
      buka() {
        this.$confirm('未填写补卡数据的将不进行补录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.bukaFrom.date = this.correctPreFrom.recordDT;
          var str = '[';
          var Bok = false;
          for (var i = 0; i < this.timedata.length; i++) {
            if (this.timedata[i].correntTime != '') {
              Bok = true;
            }
          }
          if (Bok) {
            for (var i = 0; i < this.timedata.length; i++) {
              if (this.timedata[i].correntTime != '') {
                var json = {
                  field: this.timedata[i].field,
                  correntTime: this.timedata[i].correntTime.toTimeString().slice(0, 8)
                }
                str += JSON.stringify(json) + ','
              }
            }
            str = str.substring(0, str.length - 1)
            str += ']'
            this.bukaFrom.data = str;
            this.bukaFrom.teamId = this.workerMsg.workerTeamId;
            this.bukaFrom.workerId = this.workerMsg.id;
            this.bukaFrom.laborId = this.workerMsg.workerTeam.laborServiceCompanyId;

            this.workVisible = false;
            this.datashow = false;
            correct(this.bukaFrom).then((res) => {
              if (res.data.code == 0) {
                this.timedata = [
                  {
                    field: '1',
                    correntTime: ''
                  },
                  {
                    field: '2',
                    correntTime: ''
                  },
                  {
                    field: '3',
                    correntTime: ''
                  },
                  {
                    field: '4',
                    correntTime: ''
                  }
                ];
                myCallback.call(this, res)
                // this.$notify.success({
                //   title: '补卡成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
              } else {
                myCallback.call(this, res)
                // this.$notify.error({
                //   title: '失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          } else {
            this.workVisible = false;
            this.datashow = false;
            this.timedata = [
              {
                field: '1',
                correntTime: ''
              },
              {
                field: '2',
                correntTime: ''
              },
              {
                field: '3',
                correntTime: ''
              },
              {
                field: '4',
                correntTime: ''
              }
            ]
          }
        }).catch(() => {

        });
      },
      ccc() {
        if (this.correctPreFrom.recordDT == '' || this.correctPreFrom.recordDT == null) {
          return;
        }
        this.timedata = [
          {
            field: '1',
            correntTime: ''
          },
          {
            field: '2',
            correntTime: ''
          },
          {
            field: '3',
            correntTime: ''
          },
          {
            field: '4',
            correntTime: ''
          }
        ]
        this.correctPreFrom.workerId = this.workerId;
        correctPre(this.correctPreFrom).then((res) => {
          if (res.data.code == 0) {
            this.datashow = true;
            this.data = res.data.data[0];
            if (this.data.unusualRecords) {
              var arr4 = eval('(' + this.data.unusualRecords + ')');
              this.data.unusualRecords = [];
              for (var m = 0; m < arr4.length; m++) {
                this.data.unusualRecords.push(arr4[m].clock)
              }
            } else {
              this.data.unusualRecords = []
            }
          } else {
            this.data.unusualRecords = [];
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
            this.datashow = false;
          }
        })
      },
      bukaQX() {
        this.correctPreFrom.recordDT = '';
        this.timedata = [
          {
            field: '1',
            correntTime: ''
          },
          {
            field: '2',
            correntTime: ''
          },
          {
            field: '3',
            correntTime: ''
          },
          {
            field: '4',
            correntTime: ''
          }
        ]
        this.workVisible = false;
        this.datashow = false;
      },
      bbb() {
        this.correctPreFrom.recordDT = '';
        this.timedata = [
          {
            field: '1',
            correntTime: ''
          },
          {
            field: '2',
            correntTime: ''
          },
          {
            field: '3',
            correntTime: ''
          },
          {
            field: '4',
            correntTime: ''
          }
        ]
        this.workVisible = true;
        var data = {
          projectId: this.formProject.id,
          workerManId: this.workerId
        }
        getWorkTimeByProjectIdAndWorkerManId(data).then((res) => {
          if (res.data.code == 0) {
            this.timeFrom = res.data.data;
          } else {
            myCallback.call(this, res)
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      see(item) {
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
            this.worktableData = res.data.data;
            this.teamloading = false;
          } else {
            this.teamloading = false;
            myCallback.call(this, res)
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })

      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
        }
      },
      //查询考勤
      aaa() {
        this.loading = true;
        this.tableDataShow = false;
        var str = '';
        if (this.star == null) {
          this.$notify.error({
            message: '开始月份不能为空',
            offset: 100
          });
          return;
        }
        if (this.star) {
          var str = this.star.getMonth() + 1;
          if (str < 10) {
            str = (this.star.getYear() + 1900) + '-' + '0' + str;
          } else {
            str = (this.star.getYear() + 1900) + '-' + str;
          }
        }
        var str2 = '';
        if (this.end) {
          var str2 = this.end.getMonth() + 1;
          if (str2 < 10) {
            str2 = (this.end.getYear() + 1900) + '-' + '0' + str2;
          } else {
            str2 = (this.end.getYear() + 1900) + '-' + str2;
          }
        }

        this.queryFrom.begin = str;
        this.queryFrom.end = str2;
        this.queryFrom.workerId = this.workerId;
        getWorkerCount(this.queryFrom).then((res) => {
          if (res.data.code == 0) {
            this.tableData = res.data.data;
            this.loading = false;
            this.tableDataShow = true;
          } else {
            this.loading = false;
            myCallback.call(this, res)
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      //工友改变
      workerIdChange(val) {
        if (val == '') {
          this.contentShow = false;
          this.tableDataShow = false;
          this.workerOptions = [];
          return;
        }
        this.contentShow = true;
        var arr = this.workerOptions;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == val) {
            this.workerMsg = arr[i]
          }
        }
        this.aaa();
      },
      remoteMethod(query) {
        var self = this;
        this.workerloading = true;
        if (query == '') {
          this.workerOptions = [];
          this.workerloadingText = '姓名、手机号、身份证号';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            this.workerOptions = [];
            this.workerloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            this.workerOptions = [];
            this.workerloadingText = '请最少输入5位';
            return;
          }
        }
        if (query !== '') {
          this.workerloading = true;
          var data = {
            projectId: this.formProject.id,
            'search.key': query
          }
          findManByProjectIdAndKey(data).then((res) => {
            if (res.data.code == 0) {
              this.workerloading = false;
              this.workerOptions = res.data.data;
            } else {
              this.workerloading = false;
              myCallback.call(this.res)
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }
      }
    },
  }
</script>
<style scoped>
  .workerscard {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: .2rem;
    padding-left: .2rem;
    padding-right: .2rem;
    font-size: .12rem;
    color: #606266;
  }

  .red {
    color: red;
  }
</style>
<style>
  .delHeight .el-table .cell {
    height: auto;
  }

  .workerscard .el-table__header {
    width: 100% !important;
  }

  .workerscard .el-table__body {
    width: 100% !important;
  }

  .workerscard .el-table__body .cell {
    width: 100% !important;
  }

  .el-date-picker__header {
    font-size: 0rem;
  }
</style>
