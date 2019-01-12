<template>
  <div class="contentA">
    <div class="qiyetitle">
      <div class="backResert"></div>
      <img class="logoSize" src="../../assets/buildoncloudlogo3.png"/>
      <div class="qiyetext">找回密码</div>
    </div>
    <div id="ResrtBox" style="width: 26%;margin: 0 auto;padding-bottom: .6rem">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="1.1rem" class="demo-ruleForm">
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="ruleForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="vImgCode">
          <el-input class="verificationText" v-model="ruleForm.vImgCode" type="text" auto-complete="off"
                    placeholder="请输入验证码"></el-input>
          <img class="verification" :src="this.imgUrl.verification" @click="changeImg()"/>
        </el-form-item>
        <el-form-item label="短信验证码" prop="vCode">
          <el-input class="verificationE" v-model="ruleForm.vCode" type="text" auto-complete="off"
                    placeholder="请输入短信验证码"></el-input>
          <el-button @click="getMsgCode" style="float: right;width: 1.2rem;height: .4rem;" :disabled="this.bOk"
                     size="medium">{{this.msg}}
          </el-button>
        </el-form-item>
        <el-form-item label="输入密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <el-form-item class="onlyOneThis">
          <el-button type="primary" style="width: 100%;" @click.native="edit">确认提交</el-button>
        </el-form-item>
        <el-form-item style="height: .22rem;">
          <span
            style="border: none; background: none; padding: 0; text-align: center; overflow: hidden;float: right; font-size: .13rem;line-height: .3rem"
            class="back"
            @click="goLogin">返回登录
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom2">
      雲上建瓴 | 建筑行业的颠覆者、改造者、创新者 | Copyright © 2018.卓科电子科技 All Rights Reserved. - 浙ICP备18044660号
      <div>
        <img src="../../../static/img/yunlogo.svg" alt="" style="vertical-align: middle">
        <span style="display:inline-block;width:.2rem;height: .2rem;"></span>
        <img src="../../../static/img/youtulogo.png" style="vertical-align: middle;height: .3rem;" alt="">
        <span style="display:inline-block;width:.2rem;height: .2rem;"></span>
        <img src="../../../static/img/ArcSoftLogo.png" style="vertical-align: middle;height: .2rem;" alt="">
        <span style="display: inline-block;line-height: .2rem; vertical-align:middle;font-size: .14rem;">虹软中国</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {urlGlobal, requireLogin, valiadCap, resertPass} from '../../api/api';
  import myCallback from "../../../static/common/callback"

  export default {
    data() {
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入11位手机号！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            callback();
          }
        }
      };
      var validateCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码！'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          var reg = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}/;
          if (!reg.test(value)) {
            callback(new Error('密码不能少于6位多于12位'));
          } else {
            callback();
          }
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        active: 0,

        msg: '获取验证码',

        bOk: false,

        ruleForm: {
          vImgCode: '',
          phone: '',
          pass: '',
          checkPass: ''
        },
        bokLogin: false,
        rules: {
          pass: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ],
          vImgCode: [
            {required: true, validator: validateCaptcha, trigger: 'blur'},
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          vCode: [
            {required: true, message: '请输入短信验证码', trigger: 'blur'}
          ]

        },
        imgUrl: {
          verification: urlGlobal + '/authority/captcha'
        }
      };
    },
    created() {
      this.changeImg();
    },
    methods: {
      //获取短信验证码
      getMsgCode() {
        var reg = /^[1]\d{10}$/;
        if (reg.test(this.ruleForm.phone) && this.ruleForm.vImgCode !== '') {
          var parmas = {
            phone: this.ruleForm.phone,
            vImgCode: this.ruleForm.vImgCode
          }
          var num = 60;
          this.bOk = true;
          var _this = this;
          setInterval(function () {
            num--;
            _this.msg = '请在' + num + 's后重试';
            if (num <= 0) {
              _this.msg = '获取验证码';
              _this.bOk = false;
            }
          }, 1000);
          valiadCap(parmas).then((res) => {
            if (res.data.code == '0') {
              // this.$message({
              //   message: res.data.msg,
              //   type: 'success'
              // });
              myCallback.call(this,res)
              // this.$notify.success({
              //   title: res.data.msg,
              //   // message: '只能上传1张照片',
              //   // offset: 100
              // });
            } else {
              // this.$message({
              //   message: res.data.msg,
              //   type: 'error'
              // });
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: res.data.msg,
              //   // message: '只能上传1张照片',
              //   // offset: 100
              // });
            }
          })
        } else {
          if (!reg.test(this.ruleForm.phone)) {
            // this.$message({
            //   message: '请输入11位手机号',
            //   type: 'error'
            // });
            this.$notify.error({
              title: '手机号!',
              message: '请输入11位手机号',
              // offset: 100
            });
          } else {
            // this.$message({
            //   message: '请输入图片验证码',
            //   type: 'error'
            // });
            this.$notify.error({
              title: '验证码!',
              message: '请输入图片验证码',
              // offset: 100
            });
          }
        }

      },

      // 更换图片验证码
      changeImg() {
        this.imgUrl.verification = urlGlobal + '/authority/captcha?' + new Date().getTime();
      },

      edit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var parmas = {
              vCode: this.ruleForm.vCode,
              newPwd: this.ruleForm.pass
            };
            resertPass(parmas).then((res) => {
              if (res.data.code == '0') {
                // this.$message({
                //   message: res.data.msg,
                //   type: 'success'
                // });
                this.$notify.success({
                  title: res.data.msg,
                  // message: '请输入图片验证码',
                  // offset: 100
                });
                this.$router.push('/login')
              } else {
                // this.$message({
                //   message: res.data.msg,
                //   type: 'error'
                // });
                this.$notify.error({
                  title: res.data.msg,
                  // message: '请输入图片验证码',
                  // offset: 100
                });
              }
            })
          }
        });
      },

      goLogin() {
        this.$router.push('/login')
      }
    }
  }
</script>
<style slop-scope>
  .qiyetitle {
    background: url("../../assets/rmzybjt.jpg") no-repeat;
    background-size: 100% 100%;
    margin-bottom: .5rem;
    line-height: .6rem;
    font-size: .22rem;
    width: 100%;
    height: 1.5rem;
    position: relative;
  }

  .qiyetext {
    position: absolute;
    right: 22%;
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

  .bottom2 {
    width: 100%;
    color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    line-height: .3rem;
    background: rgba(0, 0, 0, .5);
    font-size: .17rem;
  }

  .verificationText, .verificationE {
    width: calc(100% - 1.3rem);
  }

  .verification {
    height: .36rem;
    float: right;
    cursor: pointer;
  }

  .back {
    cursor: pointer;
    color: #bebebe;
  }

  .back:hover {
    color: #409eff;
  }

  #ResrtBox {
    transform: translateX(-5%);
  }

  .backResert {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

</style>
<style>
  .contentA {
    position: relative;
  }
  .contentA .el-form-item__label {
    font-size: .14rem;
    line-height: .4rem;
    padding:0 .12rem 0 0 ;
  }
  .contentA .el-input__inner {
    border-radius: .04rem;
    line-height: .4rem;
    height: .4rem;
    font-size: .14rem;
    padding: 0 .15rem;
  }
  .contentA .el-form-item__content {
    line-height: .4rem;
    font-size: .14rem;
  }
  .contentA .el-button--medium {
    padding: .1rem .2rem;
    font-size: .14rem;
    border-radius: .04rem;
  }
  .contentA .el-button {
    padding: .12rem .2rem;
    font-size: .14rem;
    border-radius: .04rem;
  }
</style>
