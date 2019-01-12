<template>
  <div id="companyA" style="font-size: 0rem">
    <!--
       审批dialog
   -->
    <el-dialog :close-on-press-escape="false" title="用户审批" :before-close="cancelState" :visible.sync="approvalVisible"
               :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="1.3rem" :rules="dataFormRules" ref="dataForm">
        <el-form-item class="lookStyleForDiv" label="公司名称">
          <el-input size="small" v-model="dataForm.unit.name" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="真实姓名" prop="username">
          <el-input size="small" v-model="dataForm.username" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="用户名" prop="phone">
          <el-input size="small" v-model="dataForm.loginname" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系方式" prop="phone">
          <el-input size="small" v-model="dataForm.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资料">
          <ul>
            <li v-if="dataForm.unit.businessLicense.fileUploadInfoId">
              <img style="cursor: pointer;" @click="imgOpen(dataForm.unit.businessLicense.fileUploadInfoId)" width="266" :src="`/workerman/fileupload/pageShowFile?fid=${dataForm.unit.businessLicense.fileUploadInfoId}`" alt="">
            </li>
          </ul>
        </el-form-item>
        <div class="doBox">
          <el-form-item label="审批状态">
            <el-radio-group size="small" v-model="approvalStatesA">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!approvalStatesA" label="驳回原因" prop="approvalNote">
            <el-input size="small" class="textareaOverflow" :autosize="true" type="textarea"
                      v-model="dataForm.approvalNote" resize="none" :rows=4></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelState">取消</el-button>
        <el-button size="medium" type="primary" @click.native="submitState">提交</el-button>
      </div>
    </el-dialog>

    <!--
        查看
    -->
    <el-dialog :close-on-press-escape="false" title="审批详情" :before-close="cancelState" :visible.sync="approvalVisibleL"
               :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="130px" ref="dataForm">
        <el-form-item class="lookStyleForDiv" label="公司名称">
          <el-input size="small" v-model="dataForm.unit.name" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="真实姓名" prop="username">
          <el-input size="small" v-model="dataForm.username" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="用户名" prop="phone">
          <el-input size="small" v-model="dataForm.loginname" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="联系方式" prop="phone">
          <el-input size="small" v-model="dataForm.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="审批状态">
          <div style="font-size: 13px; color: #5C6471 !important;">{{ dataForm.approvalState == '0' ? "通过" : "驳回" }}
          </div>
        </el-form-item>
        <el-form-item label="资料">
          <ul>
            <li v-if="dataForm.unit.businessLicense.fileUploadInfoId">
              <img style="cursor: pointer;" @click="imgOpen(dataForm.unit.businessLicense.fileUploadInfoId)" width="266" :src="`/workerman/fileupload/pageShowFile?fid=${dataForm.unit.businessLicense.fileUploadInfoId}`" alt="">
            </li>
          </ul>
        </el-form-item>

        <el-form-item label="驳回原因" v-show="dataForm.unit.approvalState == 2">
          <el-input size="small" class="textareaOverflow" type="textarea" autosize="true" disabled
                    v-model="dataForm.approvalNote" resize="none" :rows=4></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelState">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        查看大图
    -->
    <el-dialog :close-on-press-escape="false" title="营业执照" :visible.sync="imgShow"
               :close-on-click-modal="false" >
      <div style="width:100%">
        <img style="max-width:100%" :src="`/workerman/fileupload/pageShowFile?fid=${imgSrc}`" alt="">
      </div>

    </el-dialog>
    <!--
        列表
    -->
    <div style="margin-bottom: 20px;">
      <el-radio v-model="approvalStatesB" :label="-1" border size="medium">全部</el-radio>
      <el-radio v-model="approvalStatesB" :label="0" border size="medium">已通过</el-radio>
      <el-radio v-model="approvalStatesB" :label="1" border size="medium">待审批</el-radio>
      <el-radio v-model="approvalStatesB" :label="2" border size="medium">已驳回</el-radio>
    </div>
    <el-table
      class="table"
      :data="listData"
      stripe
      border
      :loading="loading"
      style="width: 100%">
      <el-table-column
        label="公司名称"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.unit ? scope.row.unit.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="真实姓名"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.username ? scope.row.username : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.loginname ? scope.row.loginname : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.phone ? scope.row.phone : ''}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="审批状态"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.approvalState }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template scope="scope">
          <el-button
            v-show="scope.row.approvalState === '待审批'"
            size="small"
            type="text"
            @click="handleWork(scope.row)">审批
          </el-button>
          <el-button
            style="margin: 0;"
            v-show="scope.row.approvalState === '已通过' || scope.row.approvalState === '已驳回'"
            size="small"
            type="text"
            @click="handleLook(scope.row)">详情
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
  </div>
</template>

<script>
  import {waitConfirmList,getAdmin,approval} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data(){
      return {
        imgShow:false,
        imgSrc:'',
        //列表
        userId:'',
        listData:[],
        loading:true,
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,
        thisNowPage: 1,
        // 审批delog
        approvalVisible: false,
        approvalVisibleL: false,
        dataForm: {
          id: '',
          unit: {
            name: '',
            approvalState:0,
            unitQualifications:[],
            businessLicense:{}
          },
          username:'',
          loginname:'',
          phone:'',
          approvalNote: ''
        },
        dataFormRules: {
          approvalNote: [
            {required: true, message: '驳回原因不能为空!', trigger: 'blur'}
          ]
        },
        approvalStatesA:true,
        //筛选
        approvalStatesB:-1
      }
    },
    created() {

      getAdmin().then((res) => {
        if (res.data.code == 0) {
          this.userId=res.data.data.id;
          this.waitConfirmList();
        } else if (res.data.code == -99) {
          this.$router.push('/login');
          myCallback.call(this,res);
          // this.$notify.error({
          //   title: '您还未登录，请登录后重试',
          //   message: res.data.msg,
          //   offset: 100
          // });
        } else {
          myCallback.call(this,res);
          // this.$notify.error({
          //   title: '失败',
          //   message: res.data.msg,
          //   offset: 100
          // });
        }
      });

    },
    mounted(){
    },
    watch:{
      approvalStatesB(val, oldVal){
        this.waitConfirmList();
      }
    },
    methods:{
      //获列
      waitConfirmList(){
        var data={
          pageSize:this.pageSize,
          pageNo:this.thisNowPage,
          userId:this.userId,
          approvalState:this.approvalStatesB
        }
        waitConfirmList(data).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (let i = 0; i < this.listData.length; i++) {
              if(this.listData[i].approvalState===0){
                this.listData[i].approvalState='已通过';
              }
              if(this.listData[i].approvalState===1){
                this.listData[i].approvalState='待审批';
              }
              if(this.listData[i].approvalState===2){
                this.listData[i].approvalState='已驳回';
              }
            }
            this.loading = false;
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          } else if (res.data.code == -99) {
            this.$router.push('/login');
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '您还未登录，请登录后重试',
            //   message: res.data.msg,
            //   offset: 100
            // });
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
      // 条数更改
      handleSizeChange(val) {
        this.pagesize = val;
        this.waitConfirmList();
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        this.waitConfirmList();
      },
      // 审批
      handleWork(val) {
        this.dataForm ={
          id: val.id,
          unit: {
            name: val.unit.name,
            approvalState:val.unit.approvalState,
            unitQualifications:val.unit.unitQualifications,
            businessLicense:val.unit.businessLicense
          },
          username:val.username,
          loginname:val.loginname,
          phone:val.phone,
          approvalNote:''
        }
        this.approvalVisible = true;
      },

      // 审批提交
      submitState() {
        this.approvalVisible = false;
        var data = {
          'userId': this.dataForm.id,
          'pass': this.approvalStatesA,
          'msg': this.dataForm.approvalNote
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            approval(data).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '操作成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '操作失败',
                //   message: res.data.msg,
                //   // offset: 100
                // });
              }
              this.dataForm.approvalNote = '';
              this.waitConfirmList();
            })
          }
        });
      },

      // 取消提交
      cancelState() {
        this.approvalVisible = false;
        this.approvalVisibleL = false;
        this.approvalStatesA = '0';
        this.dataForm = {
          id: '',
          unit: {
            name: '',
            approvalState:0,
            unitQualifications:[],
            businessLicense:{}
          },
          username:'',
          loginname:'',
          phone:'',
          approvalNote: ''
        };
        this.$refs['dataForm'].resetFields();
      },

      // 审批详情
      handleLook(val) {
        this.dataForm ={
          id: val.id,
          unit: {
            name: val.unit.name,
            approvalState:val.unit.approvalState,
            unitQualifications:val.unit.unitQualifications,
            businessLicense:val.unit.businessLicense
          },
          username:val.username,
          loginname:val.loginname,
          phone:val.phone,
          approvalNote:val.approvalNote
        }
        this.approvalVisibleL = true;
      },
      imgOpen(val){
        this.imgSrc=val;
        this.imgShow=true;
      }
    }
  }
</script>

<style scoped>
  #companyA .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }
</style>

