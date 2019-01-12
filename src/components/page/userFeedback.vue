<template>
    <div class="userFeedback">
      <div class="phoneFile">
        <el-input
          placeholder="手机, 反馈内容, 发送人名称"
          style="width:2.5rem"
          v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
          <el-date-picker
            v-model="dataTime"
            @change="timeChange"
            style="margin-left: .2rem"
            type="daterange"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        <el-time-picker
          is-range
          style="margin-left: .2rem"
          v-model="dataMuse"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
        <el-select v-model="resultCode" style="margin-left: .2rem;width: 2rem;float: none;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span style="float: right">
          <el-button type="primary" icon="el-icon-search"  size="mini"  @click="add">搜索</el-button>
        </span>
        <span style="right: .8rem;">
            <el-button   size="mini" icon="el-icon-refresh"  @click="minus">重置</el-button>
        </span>
        <span style="right: 1.6rem;">
              <el-button type="info"  size="mini" icon="el-icon-phone-outline" @click="serviceDialogVisible = true">设置</el-button>
        </span>
      </div>
      <div class="feed-list-back">
        <el-table
          :data="tableData3"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="用户名"
            align="center">
            <template scope="scope">
              <span @click="alertUser(scope.row.id,scope.row.user_id)" style="color: #188Afe;cursor: pointer">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="手机号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="city"
            label="发送时间"
            align="center">
            <template scope="scope">
              <span>{{scope.row.feedback_time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="返回信息"
            align="center">
            <template scope="scope">
              <span @click="getFeedbackForm(scope.row.id)" style="color: #188Afe;cursor: pointer;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">{{scope.row.content}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="float: right;margin-top: .2rem "
        :page-size="10"
        @current-change="handleSizeChange"
        :pager-count="11"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
      <el-dialog
        title="联系客服电话设置"
        :visible.sync="serviceDialogVisible"
        width="40%"
      >
        <h4 style="padding-left: .2rem;margin-bottom: .1rem;font-size: .14rem">反馈电话</h4>
        <ul class="phoneListAlert">
          <li v-for="(item,index) in phoneList" :key="index">
            <input type="text" maxlength="11" disabled v-bind:value="item.tel" >
            <span @click="deletePhone(item.tel)"><i class="el-icon-close"></i></span>
          </li>
          <li class="import" :style="{width:addPhoneBool?'1.4rem':'0rem'}">
            <input style="height:.38rem" ref="input1" v-model="phoneTel" type="text" focus placeholder="按回车保存手机号" @keyup.enter="toMessage" @blur="addPhoneBool = false;phoneTel = ''">
          </li>
          <!--</li>-->
          <li style="width: auto; border: none;padding:0.05rem;height: .38rem;">
            <el-button-group>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="showInput"></el-button>
            </el-button-group>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="serviceDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="客户反馈信息"
        :visible.sync="centerDialogVisible"
        width="30%"
        >
        <span style="display:block;margin-top: .2rem;font-size: .14rem;text-align: center"><h4>发送日期</h4>{{feedBackMessage.feedbackTime}}</span>
        <span style="display:block;margin-top: .2rem;font-size: .14rem;text-align: center"><h4>返回内容</h4>{{feedBackMessage.content}}</span>
        <div class="error" v-if="smsResult">
          <span style="display:block;margin-top: .2rem;font-size: .14rem;text-align: center;color: red;"><h4 style="color: #606266;">错误码</h4>{{smsResult.result}}</span>
          <!--errMsg-->
          <span style="display:block;margin-top: .2rem;font-size: .14rem;text-align: center;color: red;"><h4 style="color: #606266;">错误描述</h4>{{smsResult.errMsg}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>


      <el-dialog
        title="用户信息"
        :visible.sync="userBool"
        width="20%"
      >
        <span style="display:block;font-size: .14rem;text-align: center"><h4>姓名</h4>{{userMessage.username}}</span> <br>
        <span style="display:block;font-size: .14rem;text-align: center"><h4>邮箱</h4>{{userMessage.email}}</span> <br>
        <span style="display:block;font-size: .14rem;text-align: center"><h4>手机号</h4>{{userMessage.phone}}</span> <br>
        <span slot="footer" style="font-size: 0" class="dialog-footer">
           <el-button type="primary" @click="userBool = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    import {listPageFeedbackForm,getFeedbackForm,getSysUserInfoById,insertPhone,deletePhone,listPhone} from "../../api/api"
    import myCallback from "../../../static/common/callback"
    export default {
        data(){
          return {
            tableData3: [],
            centerDialogVisible:false,
            alertTxt:"",
            userBool:false,
            userTxt:"用户信息",
            userId:"",
            input:"",
            phoneList:[""],
            textarea:"",
            serviceDialogVisible:false,
            pageNo:1,
            search:"",
            beginDate:"",
            endDate:"",
            total:"",
            dataTime:"",
            dataMuse:"",
            options: [
              {
                value: "",
                label: '全部'
              },{
              value: 0,
              label: '成功'
              },{
              value: 1,
              label: '失败'
            }],
            resultCode:"",
            userMessage:{},
            feedBackMessage:{},
            phoneList:[],
            radioPhone:"",
            phoneTel:"",
            addPhoneBool:false,
            smsResult:"",
          }
        },
        created(){
          this.getDataList()
          this.listPhone()
        },
        methods:{
           getDataList() {
             var params = {
               pageNo:this.pageNo,
               pageSize:10,
               search:this.search,
               resultCode:this.resultCode,
               beginDate:this.beginDate,
               endDate:this.endDate,
               timeSorting:1,
             };
             listPageFeedbackForm(params).then(res => {
               if (res.data.code === 0) {
                 this.tableData3 = res.data.data.list;
                 this.total = res.data.data.totalCount;
               } else {
                 myCallback.call(this,res)
               }
             })
           },
          async alertUser(id,userId) {
             let _this = this;
             this.userId = id;
             var params = {
               id:userId
             };
            let res = await getSysUserInfoById(params);
            if (res.data.code === 0) {
              this.userBool = !this.userBool;
              this.userMessage = res.data.data;
            } else {
              myCallback.call(_this,res)
            }
          },
          timeChange(e){
          },
          add(){

            if ((Array.isArray(this.dataTime) && this.dataTime.length) && (Array.isArray(this.dataMuse) && this.dataMuse.length)) {
              this.beginDate = `${this.dataTime[0]} ${this.dataMuse[0]}`;
              this.endDate = `${this.dataTime[1]} ${this.dataMuse[1]}`;
            } else if ((this.dataTime === "" && this.dataMuse !== "") || (this.dataTime !== "" && this.dataMuse === "")) {
              this.dataTime = "";
              this.dataMuse = "";
              this.beginDate = "";
              this.endDate = "";
              this.$notify.warning({
                title:'请选择完整时间',
              });
            }else {
              this.dataTime = "";
              this.dataMuse = "";
              this.beginDate = "";
              this.endDate = "";
            }
            this.getDataList()
          },
          minus () {
            this.search = "";
            this.dataTime = "";
            this.dataMuse = "";
            this.beginDate = "";
            this.endDate = "";
            this.pageNo = 1;
            this.resultCode = "";
            this.getDataList()
          },
          handleSizeChange (e) {
            this.pageNo = e;
            this.getDataList()
          },
          toMessage() {
            if (this.serviceDialogVisible) {
                var params = {
                  tel:this.phoneTel
                };
                insertPhone (params).then(res => {
                   if (res.data.code === 0) {
                     console.log(res,'设置返回');
                     this.addPhoneBool = false
                     this.listPhone()
                   } else {
                     myCallback.call(this,res)
                   }
                })
              }
              // this.serviceDialogVisible = false;
          },
          getFeedbackForm (id) {
             let _this = this;
             var params = {
               id
             };
            getFeedbackForm(params).then(res => {
              if (res.data.code === 0) {
                this.feedBackMessage = res.data.data;
                this.centerDialogVisible = true;
                if (res.data.data.smsResult) {
                  if (res.data.data.smsResult.result === 0) {
                    this.smsResult = "";
                  } else if (res.data.data.smsResult.result !== 0) {
                    this.smsResult = res.data.data.smsResult;
                  } else {
                    this.smsResult = "";
                  }
                } else {
                  this.smsResult = "";
                }
                // console.log(JSON.parse(res.data.data.smsResult, "解析"));
              } else {
                myCallback.call(_this,res);
                this.feedBackMessage = {};
                // this.centerDialogVisible = true;
              }
            })
          },
          listPhone () {
            listPhone().then(res => {
              if (res.data.code === 0 ) {
                this.phoneList = res.data.data;
              }
            })
          },
          deletePhone (tel) {
             var params = {
               tel
             };
            deletePhone(params).then(res => {
              if (res.data.code === 0) {
                this.listPhone()
              } else {
                myCallback.call(this,res)
              }
            })
          },
          showInput(){
            this.addPhoneBool = true;
            console.log(this.$refs);
            this.$refs.input1.focus()
          }
        }
    }
</script>

<style scoped>
  .userFeedback {
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 0;
    width: 100%;
    height: calc(100% - .9rem);
    padding: 0 .2rem;
    box-sizing: border-box;
    overflow-y: scroll;
    user-select: none;
  }
  .phoneFile {
    position: relative;
    display: block;
    width: auto;
    /*height: .4rem;*/
    transition: all .3s;
    border-bottom:1px solid #ccc ;
    font-size: 0;
    padding: 0 0 .5rem .1rem;
    box-sizing: border-box;
    margin-bottom: .2rem;
  }
  .phoneFile span {
    position: absolute;
    right: 0;
    bottom: .1rem;
    /*transform: translateY(50%);*/
    display: inline-block;
    vertical-align: middle;
    margin-right: .1rem
  ;
  }
  .phoneFile .phoneList {
    display: inline-block;
    font-size: .12rem;
    vertical-align: middle;
  }
  .phoneListAlert {
    width: 100%;
    list-style: none;
    font-size: .14rem;
  }
  .phoneListAlert .import {
    display: inline-block;
    border: none;
    transition: width .3s;
    overflow: hidden;
    padding: 0;
    /*margin: 0.05rem  0 0 .2rem ;*/
  }
  .phoneListAlert .import input {
    border: 1px solid #188AFE;
    border-radius: .05rem;
    box-sizing: border-box;
    width: 1.4rem;
    padding: 5px;
    outline:none;
  }
  /*.phoneListAlert .import input:focus {*/
    /*border: none;*/
  /*}*/
  .phoneListAlert li {
    display: inline-block;
    padding: .1rem;
    box-sizing: border-box;
    color: #888;
    /*line-height: .4rem;*/
    /*border-bottom: 1px solid #cccccc ;*/
    width: 1.4rem;
    border: 1px solid #cccccc;
    border-radius: 5px;
    margin-left: .2rem;
    vertical-align: middle;
    margin-bottom: .1rem;
  }
  .phoneListAlert li span {
    display: none;
    cursor: pointer;
  }
  .phoneListAlert li:hover span {
    display: inline-block;
  }
  .phoneListAlert li input {
    background-color: #ffffff;
    border: none;
    width: 1rem;
  }
  .error {
    border-top: 1px solid #ccc;
    margin-top: .1rem;
  }
</style>
<style>
   /*.el-dialog__title {*/
    /*display: inline-block;*/
    /*width: 100%;*/
    /*left: 0;*/
  /*}*/
  .el-dialog__footer {
    font-size: 0;
  }
   .phoneListAlert li .el-input__inner {
    line-height: .38rem;
     height: .38rem;
  }
</style>
