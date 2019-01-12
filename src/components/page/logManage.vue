<template>
  <div>
    <div class="block" style="font-size: 0rem">
      <el-date-picker
        class="time"
        v-model="dateBE"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="searchBtn" style="right: 8%;" size="small" icon="el-icon-refresh" @click='clear'>重置</el-button>
      <el-button class="searchBtn" type="primary" size="small" icon="el-icon-search" @click='search'>搜索</el-button>
    </div>

    <!--
        列表
    -->
    <el-table
      class="table"
      :data="listData"
      border
      style="width: 100%">
      <el-table-column
        label="日志类型"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日志内容"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="执行类"
        width="300"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.src }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.opAt }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务器ip"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据" width="200px">
        <template scope="scope">
          <el-button
            size="small"
            @click="lookNum(scope.row.param)">参数
          </el-button>
          <el-button
            size="small"
            @click="lookResult(scope.row.result)">结果
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
    <div class="block">
      <el-pagination
        class="pageCurrent"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes='pageArr'
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <span style="width: 100%; height: 300px; overflow: scroll; display: block;">{{nowData}}</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
              </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getLogList} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      return {
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        pageArr: [10, 20, 30, 40],

        bTime: '',
        eTime: '',

        dateBE: '',

        nowData: '',
        dialogVisible: false,

        thisNowPage: 1
      }
    },
    methods: {
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

      getList(parmas) {
        getLogList(parmas).then((res) => {
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              this.listData[i].opAt = this.getMyDate(this.listData[i].opAt * 1000)
            }
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

      clear() {
        this.dateBE = '';
      },

      search() {
        if (this.dateBE == '') {
          this.bTime = '';
          this.eTime = '';
        } else {
          this.bTime = this.dateBE[0] + '';
          this.eTime = this.dateBE[1] + '';
        }
        let parmas = {
          'pageNo': this.thisNowPage,
          'beginDate': this.bTime,
          'endDate': this.eTime,
          'pageSize': this.pagesize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        if (this.dateBE == null) {
          this.bTime = '';
          this.eTime = '';
        } else {
          this.bTime = this.dateBE[0];
          this.eTime = this.dateBE[1];
        }
        this.pagesize = val;
        let parmas = {
          'pageNo': this.thisNowPage,
          'beginDate': this.bTime,
          'endDate': this.eTime,
          'pageSize': this.pagesize
        }
        this.getList(parmas);
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        if (this.dateBE == '') {
          this.bTime = '';
          this.eTime = '';
        } else {
          this.bTime = this.dateBE[0] + '';
          this.eTime = this.dateBE[1] + '';
        }
        let parmas = {
          'pageNo': this.thisNowPage,
          'beginDate': this.bTime,
          'endDate': this.eTime,
          'pageSize': this.pagesize
        }
        this.getList(parmas);
      },

      lookNum(data) {
        this.dialogVisible = true;
        this.nowData = data;
      },

      lookResult(data) {
        this.dialogVisible = true;
        this.nowData = data;
      }
    }
  }
</script>
<style scoped>
  .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .searchBtn {
    position: absolute;
    right: 0;
    top: .05rem;
  }

  .block {
    margin-bottom: .3rem;
    position: relative;
  }
</style>
<style>
 .block .el-date-editor--daterange.el-input__inner {
    width: 3.5rem;
  }
  .block .el-input__inner {
    height: .4rem;
    line-height: .4rem;
  }
  .block .el-input__icon {
    width: .25rem;
  }
  .block .el-date-editor .el-range__icon {
    font-size: .14rem;
    margin-left: -.05rem;
    line-height: .32rem;
  }
  .block .el-date-editor .el-range-input {
    font-size: .14rem;
  }
  .block .el-date-editor .el-range-separator {
    font-size: .14rem;
  }
  .block .el-date-editor .el-range-separator {
    line-height: .32rem;
  }
  .el-date-editor .el-range__close-icon{
    line-height: .32rem;
  }
  .block .time .el-range__close-icon:after {
    content: 'x';
  }
</style>
