<template>
  <!--企业注册-->
  <div style="width: 100%;position: relative; background: #f1f5f8;" class="qiye">
    <div class="qiyetitle">
      <div class="backQiye"></div>
      <img class="logoSize" src="../../assets/buildoncloudlogo3.png"/>
      <div class="qiyetext">企业注册</div>
    </div>
    <div id="qiye" style="width: 40%;margin: 0 auto;padding-bottom:1rem;">
      <el-form :model="addForm" label-width="1.2rem" :rules="addFormRules"  ref="addForm">
        <el-form-item label="营业执照"  prop="keys">
          <el-upload
            class="avatar-uploader"
            action="/workerman/fileupload/ocrUpload"
            :show-file-list="false"
            v-loading="loading"
            ref="upload"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleChange"
            :on-exceed="addOut">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">只能上传一张jpeg,pdf,gif,png,bmp等类型的图片文件，且不超过500kb。</div>
        </el-form-item>
        <div style="overflow: hidden">
          <transition enter-active-class="slideInDown" leave-active-class="slideOutUp">
            <div class="animated" v-if="this.addForm.keys.length>0" animate-delay="0s" animate-duration="1s">
              <el-form-item label="管理员姓名"  prop="username">
                <el-input :maxlength="20" size="small" v-model="addForm.username" placeholder="请输入用户名" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="管理员联系方式"  prop="phone">
                <el-input :maxlength="20" size="small" v-model="addForm.phone" placeholder="请输入联系方式" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="登录用户名"  prop="loginName">
                <el-input size="small" v-model="addForm.loginName" placeholder="请输入邮箱" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input :type="oldPassType" v-model="addForm.password" placeholder="请输入密码"  auto-complete="off">
                  <i class="el-input__icon"
                     style="width: .4rem; cursor: pointer;"
                     slot="suffix"
                     @click="seeOldPass">
                    <img style="padding-top:.06rem ;" v-if="oldPassType==='password'" src="../../assets/隐藏1.png" alt="">
                    <img style="padding-top:.06rem ;" v-else src="../../assets/显示1.png" alt="">
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="repassword">
                <el-input :type="oldPassType2" v-model="addForm.repassword" placeholder="请再次输入密码" auto-complete="off">
                  <i class="el-input__icon"
                     style="width: .4rem; cursor: pointer;"
                     slot="suffix"
                     @click="seeOldPass2">
                    <img style="padding-top:.06rem;" v-if="oldPassType2==='password'" src="../../assets/隐藏1.png" alt="">
                    <img style="padding-top:.06rem;" v-else src="../../assets/显示1.png" alt="">
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item label="公司名称"  prop="businessName">
                <el-input :maxlength="20" size="small" v-model="addForm.businessName" placeholder="请输入公司名称" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册号"  prop="businessId">
                <el-input :maxlength="20" size="small" v-model="addForm.businessId" placeholder="请输入注册号" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人"  prop="businessPerson">
                <el-input :maxlength="20" size="small" v-model="addForm.businessPerson" placeholder="请输入法定代表人" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input :maxlength="20" size="small" v-model="addForm.businessAddress" placeholder="请输入地址" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册资本">
                <el-input :maxlength="20" size="small" v-model="addForm.businessCapital" placeholder="请输入注册资本" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="经营范围">
                <el-input :maxlength="20" size="small" v-model="addForm.businessScope" placeholder="请输入经营范围" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="营业期限">
                <el-input :maxlength="20" size="small" v-model="addForm.businessTerm" placeholder="请输入营业期限" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="主体类型">
                <el-input :maxlength="20" size="small" v-model="addForm.businessType" placeholder="请输入主体类型" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="组成形式">
                <el-input :maxlength="20" size="small" v-model="addForm.businessOrganization" placeholder="请输入组成形式" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </transition>
        </div>


      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;"  v-if="this.addForm.keys.length>0">
        <el-button size="small" style="width: 30%" type="primary" @click.native="addBtn">注册</el-button>
      </div>
      <span style="float: right;font-size: .14rem;margin-top: .1rem;color: #409eff;cursor: pointer;" @click="cencelBtn">返回登录</span>
    </div>
    <div class="bottom2" style="font-size: .16rem">
      雲上建瓴 | 建筑行业的颠覆者、改造者、创新者 | Copyright © 2018.卓科电子科技 All Rights Reserved. - 浙ICP备18044660号
      <div>
        <img src="../../../static/img/yunlogo.svg" alt=""  style="vertical-align: middle">
        <span style="display:inline-block;width:.2rem;height: .2rem;"></span>
        <img src="../../../static/img/youtulogo.png" style="vertical-align: middle;height:.3rem" alt="">
        <span style="display:inline-block;width:.2rem;height: .2rem;"></span>
        <img src="../../../static/img/ArcSoftLogo.png" style="vertical-align: middle;height:.2rem" alt="">
        <span style="display: inline-block;line-height: .2rem; vertical-align:middle;font-size: .14rem;">虹软中国</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {checkUnit,checkUser,createUserByZK} from '../../api/api.js'
  import myCallback from "../../../static/common/callback"
  export default {
    name: "qiye",
    data: function () {
      // 校验公司名称
      var validLaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司名称！'));
        } else{
          if(!/^[^\s]+$/.test(value)){
            callback(new Error('公司名称不能带有空格！'));
          }else {
            var parmas = {
              name: value
            }

            checkUnit(parmas).then((res) => {
              if(res.data.code == 0) {
                callback()
              }else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };
      // 校验法人名称
      var validLaName2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入法人名称！'));
        } else{
          var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          if(!reg.test(value)) {
            callback(new Error('1-15个汉字'));
          }else {
            callback()
          }

        }
      };
      // 校验税号
      var validAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入税号！'));
        } else{
          var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入18位的税号！'));
          }else {
            callback();
          }
        }
      };
      // 校验手机
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号！'));
        } else{
          var reg = /^[1]\d{10}$/ ;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          }
          callback();
        }
      };
      // 确认密码
      var validatepassword = (rule, value, callback) => {
        if(value==''){
          return callback(new Error('请再次输入密码'));
        }
        if (this.addForm.password === this.addForm.repassword) {
          callback();

        } else{
          callback(new Error('两次密码输入不一致！'));
        }
      };
      // 校验邮箱
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱！'));
        } else {
          var reg =/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的邮箱！'));
          }else {
            var parmas = {
              'loginName' : value
            }

            checkUser(parmas).then((res) => {
              if(res.data.code == 0) {
                if(res.data.data === false) {
                  callback('该邮箱已被使用!');
                }else {
                  callback();
                }
              }else {
                callback(res.data.msg);
              }
            })
          }
        }
      };

      // 注册号校验
      var registration = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入注册号！'));
        } else{
          if(/[^\d]/.test(value)){
            callback(new Error('注册号格式不正确！'));
          }else {
            var parmas = {
              name: value
            }

            // checkUnit(parmas).then((res) => {
            //   if(res.data.code == 0) {
            //     callback()
            //   }else {
            //     callback(new Error(res.data.msg))
            //   }
            // })
          }
        }
      };
      return {
        contentType:0,
        //添加劳务公司弹层
        addVisible:false,
        //添加劳务公司form
        addForm : {
          businessName: '',
          businessId:'',
          businessPerson:'',
          businessAddress:'',
          businessCapital:'',
          businessScope:'',
          businessTerm:'',
          businessType:'',
          businessOrganization:'',


          keys: [],
          username:'',
          phone:'',
          loginName:'',
          password:'',
          repassword:'',
        },
        addFormRules : {
          businessName: [
            {required: true, validator:validLaName , trigger: 'blur'}
          ],
          businessId: [
            {required: true, validator:registration, trigger: 'blur'}
          ],
          businessPerson: [
            {required: true, message:'请填写法定代表人', trigger: 'blur'}
          ],

          keys: [
            {required: true, type:'array',  message:'请上传资质文件' , trigger: 'blur'}
          ],
          username: [
            {required: true,  message:'请输入用户名' ,trigger: 'blur'}
          ],
          phone: [
            {required: true,  validator:validatePhone  ,trigger: 'blur'}
          ],
          loginName: [
            { required:true, validator: validateEmail, trigger: 'blur'},
            { min: 1, max: 50, message: '用户名最大长度不能超过50个字符!', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          repassword: [
            {required: true, validator: validatepassword, trigger: 'blur'}
          ],
        },
        oldPassType: 'password',
        oldPassType2: 'password',
        //图片回显
        imageUrl:'',
        //上传加载
        loading:false,
      }
    },
    methods:{
      // 点击创建劳务公司
      clickAdd(type) {
        this.contentType = 1;
      },

      // 上传限制
      beforeAvatarUpload(file) {
        this.loading=true;
        const ifPDF = file.type === 'application/pdf';
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP && !ifPDF) {
          // this.$message({
          //   showClose: true,
          //   message: '只能上传jpeg,pdf,gif,png,bmp等类型的图片文件',
          //   type: 'warning'
          // });
          this.$notify.warning({
            title: '图片格式!',
            message: '只能上传jpeg,pdf,gif,png,bmp等类型的图片文件',
            // offset: 100
          });
          this.loading=false;
        }
        if (!isLt2M) {
          // this.$message({
          //   showClose: true,
          //   message: '文件大小不超过500kb',
          //   type: 'warning'
          // });
          this.$notify.warning({
            title: '文件大小!',
            message: '文件大小不超过500kb',
            // offset: 100
          });
          this.loading=false;
        }

        return (isJPG || isBMP || isGIF || isPNG || ifPDF) && isLt2M;
      },
      // 上传图片  删除  和 上传成功的操作
      // handleRemove(file, fileList) {
      //   this.addForm.keys = [];
      //   this.addForm.businessName='';
      //   this.addForm.businessId='';
      //   this.addForm.businessPerson='';
      //   this.addForm.businessAddress='';
      //   this.addForm.businessCapital='';
      //   this.addForm.businessScope='';
      //   this.addForm.businessTerm='';
      //   this.addForm.businessType='';
      //   this.addForm.businessOrganization='';
      // },
      handleChange(response, file, fileList) {
        this.loading=false;
        if(response.msg==="BIZLICENSE_OCR_RECOG_FAILED"){
          // this.$message({
          //   showClose: true,
          //   message: '请上传正确的营业执照',
          //   type: 'warning'
          // });
          this.$notify.warning({
            title: '请上传正确的营业执照!',
            // message: '文件大小不超过500kb',
            // offset: 100
          });
          return;
        }
        if(response.data.ocrInfo.success) {
          var arr=[];
          arr.push(fileList.pop().response.data.key)
          this.addForm.keys = arr;
          var json=response.data.ocrInfo.data;
          this.imageUrl = URL.createObjectURL(file.raw);
          this.addForm.businessName=json.businessName;
          this.addForm.businessId=json.businessId;
          this.addForm.businessPerson=json.businessPerson;
          this.addForm.businessAddress=json.businessAddress;
          this.addForm.businessCapital=json.businessCapital;
          this.addForm.businessScope=json.businessScope;
          this.addForm.businessTerm=json.businessTerm;
          this.addForm.businessType=json.businessType;
          this.addForm.businessOrganization=json.businessOrganization;
          this.addForm.username='';
          this.addForm.phone='';
          this.addForm.loginName='';
          this.addForm.password='';
          this.addForm.repassword='';
        }
      },
      addOut() {
        // this.$message({
        //   showClose: true,
        //   message: '只能上传1张照片',
        //   type: 'warning'
        // });
        this.$notify.warning({
          title: '照片!',
          message: '只能上传1张照片',
          // offset: 100
        });
        //
      },
      // 创建劳务公司取消提交
      cencelBtn() {

        this.$refs['addForm'].resetFields();
        this.$refs.upload.clearFiles();
        this.imageUrl='';
        this.$router.push('/login');
      },
      handleClose() {
        this.$refs['addForm'].resetFields();
      },
      // 创建劳务公司确认提交
      addBtn () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            this.$refs['addForm'].resetFields();
            this.addForm.keys = [];
            this.addForm.businessName='';
            this.addForm.businessId='';
            this.addForm.businessPerson='';
            this.addForm.businessAddress='';
            this.addForm.businessCapital='';
            this.addForm.businessScope='';
            this.addForm.businessTerm='';
            this.addForm.businessType='';
            this.addForm.businessOrganization='';
            this.imageUrl='';
            this.loading=true;
            createUserByZK(parmas).then((res) => {
              if (res.data.code == '0') {
                this.loading=false;
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '注册成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.$router.push('/login');
              } else {
                this.loading=false;
                myCallback.call(this,res)
                // this.$notify.error({
                //   title: '注册失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        });
      },
      seeOldPass() {
        if (this.oldPassType == 'password') {
          this.oldPassType = 'text';
        } else {
          this.oldPassType = 'password';
        }
      },
      seeOldPass2() {
        this.oldPassType2 == 'password'?this.oldPassType2 = 'text':this.oldPassType2 = 'password';
      },

    }
  }
</script>

<style scoped>
  .qiyetitle{
    background: url("../../assets/rmzybjt.jpg") no-repeat;
    background-size: 100% 100%;
    margin-bottom: .2rem;
    line-height: .6rem;
    font-size: .22rem;
    width: 100%;
    height:1.5rem;
    position: relative;
  }
  .qiyetext{
    position: absolute;
    right:22%;
    top: .45rem;
    color: #fff;

  }
  .logoSize {
    position: absolute;
    left: .2rem;
    top: .1rem;
    z-index: 2;
    width: 2rem;
  }
  .bottom2{
    width: 100%;
    color:#fff;
    position: fixed;
    left: 0;
    bottom: 0;
    text-align: center;
    line-height: .3rem;
    background: rgba(0,0,0,.5);
  }
  #qiye{
    transform: translateX(-5%);

  }


  .backQiye {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
  }
</style>
<style>
  .avatar-uploader{
    width: 4.04rem;
    height: 2.65rem;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: .06rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 4.04rem;
    height: 2.65rem;
    background: url("../../assets/营业执照.jpg") center center no-repeat;
    background-size: 100%;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: .5rem;
    color: #fff;
    width: 4.04rem;
    height: 2.65rem;
    line-height: 2.65rem;
    text-align: center;
    background: rgba(0,0,0,0.4);
  }
  .avatar {
    width: 4.04rem;
    height: 2.65rem;
    display: block;
  }

</style>
<style>
  .el-upload--text {
    width: .36rem;
    height: 1.8rem;
  }
  .el-upload--text {
    font-size: .14rem;
  }
  .el-upload__tip {
    font-size: .12rem;
    margin-top: .07rem;
  }
  .el-form-item__label{
    font-size: .14rem;
    padding: 0 .12rem 0 0 ;
  }
  .el-form-item__content {
    line-height: .4rem;
  }
</style>
