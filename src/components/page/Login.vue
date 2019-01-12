<template>
  <div class="loginBg" v-show="bindShow !== ''">
    <div class="backgroundImage" style="position: relative;width: 100%;height: 100%;overflow: hidden;">
      <div class="login-container">
        <el-form v-show="bindShow === false" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
                 class="demo-ruleForm ">
          <el-form-item prop="loginname" style="position: relative;">
            <img style="position: absolute; top: .1rem; left: .1rem; z-index: 99;width: .18rem;" src="../../assets/login.png"/>
            <el-input type="text" v-model="ruleForm.loginname" auto-complete="off" placeholder="账号">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="position: relative;">
            <img style="position: absolute; top: .1rem; left: .1rem; z-index: 99;width: .18rem;" src="../../assets/pass.png"/>
            <el-input :type="this.newPassType" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
              <i class=" el-input__icon"
                 style="width: .4rem; cursor: pointer;"
                 slot="suffix"
                 @click="seePass">
                <img style="padding-top:.06rem;width: .32rem;" v-if="this.newPassType==='password'" src="../../assets/隐藏.png" alt="">
                <img style="padding-top:.06rem;width: .32rem;" v-else src="../../assets/显示.png" alt="">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="padding: 0;" id="your-dom-id" class="nc-container"></div>
          </el-form-item>
          <el-form-item style="width:100%;">
            <span class="haha" size="small" @click="goToForgetPage()">忘记密码?</span>
            <a class="haha" target="_self" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxc3e39da9a884edb7&redirect_uri=https://test.buildoncloud.cn&response_type=code&scope=snsapi_login" style="margin-right: 10px;">微信登陆</a>
            <a class="haha" target="_self" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxc3e39da9a884edb7&redirect_uri=https://test.buildoncloud.cn&response_type=code&scope=snsapi_login" size="small" style="margin-right:.05rem; width: .2rem;height: .4rem;background: url('../../../static/img/wxlogo.png') no-repeat center center; background-size: 100% 50%;"></a>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px;">
            <!--<el-checkbox class="rememberStyle" v-model="rememberChecked">记住账号</el-checkbox>-->
          </el-form-item>
        </el-form>

        <el-form v-show="bindShow === true" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
                 class="demo-ruleForm ">
          <el-form-item prop="loginname" style="position: relative;">
            <img style="position: absolute; top: .1rem; left: .1rem; z-index: 99;width: .18rem;" src="../../assets/login.png"/>
            <el-input type="text" v-model="ruleForm.loginname" auto-complete="off" placeholder="账号">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="position: relative;">
            <img style="position: absolute; top: .1rem; left: .1rem; z-index: 99;width: .18rem;" src="../../assets/pass.png"/>
            <el-input :type="this.newPassType" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
              <i class=" el-input__icon"
                 style="width: .4rem; cursor: pointer;"
                 slot="suffix"
                 @click="seePass">
                <img style="padding-top:.06rem;width: .32rem;" v-if="this.newPassType==='password'" src="../../assets/隐藏.png" alt="">
                <img style="padding-top:.06rem;width: .32rem;" v-else src="../../assets/显示.png" alt="">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative;">
            <el-button style="width: 100%;" plain @click="bindUser">绑定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="nav" class="nav">
        <img class="logoSize" src="../../assets/buildoncloudlogo3.png"/>
        <ul style="float: right;height: 60px;padding-right: 100px;" class="navContent">
          <li class="navItem">
            产品
            <ul class="navSelectBox">
              <span id="jiao"></span>
              <li class="navSelectBoxItem">
                <a href="../../../static/html/labour.html" target="_blank">建瓴劳务</a>
              </li>
              <li class="navSelectBoxItem">
                <a href="../../../static/html/home/BIMPage.html" target="_blank">建瓴云图</a>
              </li>
              <li class="navSelectBoxItem">
                <a href="../../../static/html/materiel.html" target="_blank">建瓴物料</a>
              </li>
              <li class="navSelectBoxItem">
                <a href="../../../static/html/process.html" target="_blank">建瓴进程</a>
              </li>
            </ul>
          </li>
          <li class="navItem" @click="navClick(1,-1)">
            <a href="../../../static/html/aiBuild.html" target="_blank">解决方案</a>
          </li>
          <li class="navItem" @click="navClick(2,-1)">
            <a href="../../../static/html/contact.html" target="_blank">关于我们</a>
          </li>
          <li class="navItem" @click="navClick(3,-1),clickAdd()">
            企业注册
          </li>
        </ul>
      </div>
      <div class="bottom">
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
  </div>
</template>

<script>
  import {
    getMenu,
    wechatCallback,
    bindWechat,
    verifyCaptchaAndLogin
  } from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data: function () {
      // var validateNc = (rule, value, callback) => {
      //   if (value === 0) {
      //       callback(new Error('请进行滑动验证！'));
      //   } else if(value=== -1){
      //     this.nc.reset();
      //     callback(new Error('验证失败请重试！'));
      //   }else{
      //     callback();
      //   }
      // };
      return {
        userCode: '',
        bindShow: '',
        rememberChecked: false,
        goFor: '',
        newPassType: 'password',
        ruleForm: {
          loginname: '',
          password: ''
        },
        bokLogin: false,
        rules: {
          loginname: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        activeIndex: -1,
        activeIndextype: -1,
        captcha1: null,
        nc: null,
        key:'lcz9nMOvwnOm6k2GmGtWqkPZhSPBHcMn',
        iv:'FK6xEV37'
      }
    },
    created() {
      if (window.localStorage.getItem('ms_username') === 'null') {
        window.localStorage.clear()
      } else {
        this.ruleForm.loginname = window.localStorage.getItem('ms_username');
        this.rememberChecked = window.localStorage.getItem('rememberChecked') === "false" ? false : true;
        window.localStorage.clear();
        window.localStorage.setItem('ms_username', this.ruleForm.loginname);
        window.localStorage.setItem('rememberChecked', this.rememberChecked);
      }
    },
    mounted() {
      this.userCode = this.getQuery('code');
      if(this.userCode) {
        let parmas = {
          'code': this.userCode
        }
        wechatCallback(parmas).then((res) => {
          if(res.data.code == 0) {
            window.sessionStorage.setItem('tokenId',res.data.data.tokenId);
            window.sessionStorage.setItem('tokenStr',res.data.data.tokenStr);
            getMenu().then((res) => {
              self.goFor = res.data.data[0].name;
              self.$router.push('/' + self.goFor);
            });
          }else if(res.data.code == 2) {
            this.bindShow = true;
          }else {
            this.bindShow = false;
          }
        })
      }else {
        this.bindShow = false;
      }
      /**
       *  挂载 拖拽验证码
       *
       * */
      var self = this;
      ~function () {
        var nc_token = ["FFFF0N00000000006C86", (new Date()).getTime(), Math.random()].join(':');
        var NC_Opt =
          {
            renderTo: "#your-dom-id",
            appkey: "FFFF0N00000000006C86",
            scene: "register",
            token: nc_token,
            customWidth: 300,
            trans: {"key1": "code0"},
            elementID: ["usernameID"],
            is_Opt: 0,
            language: "cn",
            isEnabled: true,
            timeout: 3000,
            times: 5,
            apimap: {
              // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
              // 'get_captcha': '//b.com/get_captcha/ver3',
              // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
              // 'get_img': '//c.com/get_img',
              // 'checkcode': '//d.com/captcha/checkcode.jsonp',
              // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
              // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
              // 'umid_serUrl': 'https://g.com/service/um.json'
            },
            callback: function (data) {
              self.$refs.ruleForm.validate((valid) => {
                if (valid) {
                  var parmas = Object.assign({
                    sig: data.sig,
                    token: nc_token,
                    scene: 'register',
                    sessionId: data.csessionid
                  }, self.ruleForm);
                  parmas.password=self.encryptByDES(parmas.password);
                  self.bokLogin = true;

                  verifyCaptchaAndLogin(parmas).then((res) => {
                    if (res.data.code == 0) {
                      window.sessionStorage.setItem('tokenId',res.data.data.tokenId);
                      window.sessionStorage.setItem('tokenStr',res.data.data.tokenStr);
                      getMenu().then((res) => {
                        self.goFor = res.data.data[0].name;
                        self.$router.push('/' + self.goFor);
                      });
                      if (this.rememberChecked == true) {
                        window.localStorage.setItem('ms_username', self.ruleForm.loginname);
                        window.localStorage.setItem('rememberChecked', self.rememberChecked);
                      } else {
                        window.localStorage.removeItem('ms_username');
                        window.localStorage.setItem('rememberChecked', self.rememberChecked);
                      }
                    } else {
                      myCallback.call(self,res);
                      self.bokLogin = false;
                      self.nc.reload();
                    }
                  })
                } else {
                  self.nc.reload();
                  console.log('error submit!');
                  return false;
                }
              });
            }
          }
        self.nc = new noCaptcha(NC_Opt)
        self.nc.upLang('cn', {
          _startTEXT: "请向右滑动登录",
          _yesTEXT: "成功",
          _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
          _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
        })


      }();

      var itemRatio = document.documentElement.clientWidth/document.documentElement.clientHeight;
      var standRatio = 1920/1080;
      if (document.documentElement.clientWidth<document.documentElement.clientHeight) {
        var img =  document.getElementsByClassName('backgroundImage')[0];
        img.style.backgroundSize = "auto 100%";
        img.style.backgroundPositionX =  '-3.5rem';
      } else {
        if (itemRatio>standRatio) {
          var img =  document.getElementsByClassName('backgroundImage')[0];
          img.style.backgroundSize = "100% auto";
          img.style.backgroundPositionY = -(itemRatio-standRatio) *2 +'rem';
        } else if (itemRatio === standRatio) {
          var img =  document.getElementsByClassName('backgroundImage')[0];
          img.style.backgroundSize = "100% 100%";
        } else {
          var img =  document.getElementsByClassName('backgroundImage')[0];
          img.style.backgroundSize = "auto 100%";
        }
      }
    },
    methods: {
      // 绑定微信
      bindUser() {
        let _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            bindWechat(this.ruleForm).then((res) => {
              if (res.data.code == 0) {
                window.sessionStorage.setItem('tokenId',res.data.data.tokenId);
                window.sessionStorage.setItem('tokenStr',res.data.data.tokenStr);
                getMenu().then((res) => {
                  // console.log(res,'登录成功之后的调用');
                  _this.goFor = res.data.data[0].name;
                  console.log(_this.goFor, res.data.data)
                  // console.log(self.goFor,"登录地址");
                  _this.$router.push('/' + _this.goFor);
                });
                if (this.rememberChecked == true) {
                  window.localStorage.setItem('ms_username', self.ruleForm.loginname);
                  window.localStorage.setItem('rememberChecked', self.rememberChecked);
                } else {
                  window.localStorage.removeItem('ms_username');
                  window.localStorage.setItem('rememberChecked', self.rememberChecked);
                }
              } else {
                this.$notify.error({
                  title: res.data.msg,
                  offset: 100
                });
                this.bokLogin = false;
                this.nc.reload();
              }
            })
          }
        });
      },

      // 正则过滤链接
      getQuery(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
      },

    // 类别转换
      typeChange() {
        this.contentType = !this.contentType;
      },

      navClick(index, type) {
        this.activeIndex = index;
        this.activeIndextype = type;
      },
      handleSelect(key, keyPath) {

      },
      // 点击显示password或者text
      seePass() {
        if (this.newPassType == 'password') {
          this.newPassType = 'text';
        } else {
          this.newPassType = 'password';
        }
      },
      // 跳到忘记密码
      goToForgetPage() {
        this.$router.push('/ResertPassword');
      },
      clickAdd() {
        this.$router.push('/enterprise');
      },
      //加密
      encryptByDES(message) {
        var keyHex = CryptoJS.enc.Utf8.parse(this.key);
        var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
      }
    }
  }
</script>

<style slop-scope>

  #jiao {
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: transparent transparent #fff transparent;
    border-style: solid dashed dashed dashed;
    border-width: 10px;
    position: absolute;
    top: -20px;
    left: calc(50% - 10px);
  }

  .bottom {
    width: 100%;
    color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    line-height: .3rem;
    background: rgba(0, 0, 0, .5);
    font-size: .16rem;
  }

  .logoSize {
    position: absolute;
    left: .2rem;
    top: .1rem;
    z-index: 2;
    width: 2rem;
  }

  .backgroundImage {
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    background: url("../../assets/背景.jpg") no-repeat;
    /*background-size: 13.66rem 7.68rem;*/
    /*background-position-y: -1rem;*/
    background-size: 100% 100%;
  }

  .elwImg {
    position: absolute;
    top: 15%;
    left: 50%;
    margin-left: -189px;
  }

  .logo {
    display: block;
    margin: 0 auto 30px;
    width: 100px;
  }

  .loginBg {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
  }

  .login-container {
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 3.7rem;
    margin-top: -1.75rem;
    /*height: 180px;*/
    overflow: hidden;
    padding: .4rem .4rem 0rem .4rem;
    z-index: 3;
    background: rgba(0,0,0,.5);
    /*border: 1px solid #fff;*/
    /*border-radius: 5px;*/
  }

  .loginBg .verificationText {
    width: 240px;
  }

  .verification {
    height: 36px;
    float: right;
    cursor: pointer;
  }

  .haha {
    background: none;
    border: none;
    float: right;
    color: #ccc;
    display: block;
    cursor: pointer;
  }

  .rememberStyle {
    position: absolute;
    right: 90px;
    top: -6px;
  }

  .rememberStyle .el-checkbox__label {
    color: #bebebe;
    font-size: 12px;
    line-height: 20px;
  }

  .rememberStyle .el-checkbox__inner {
    width: 12px;
    height: 12px;
    left: 3px;
  }

  .nav {
    width: 100%;
    background: none;
    padding-top: 20px;
    position: absolute;
    left: 0;
    top: 0;
    height: 60px;
  }

  .navContent .navItem {
    float: left;
    width: .96rem;
    line-height: .6rem;
    text-align: center;
    color: #fff;
    cursor: pointer;
    font-size: .16rem;
  }

  .navSelectBox {
    display: none;
    position: relative;
  }

  .navItem:hover .navSelectBox {
    display: block;
  }

  .navSelectBox {
    background: #fff;
    padding-top: 15px;
    padding-bottom: 15px;
    z-index: 99;
  }

  #nav .navItem:hover > a {
    color: #409eff;
  }

  #nav .navSelectBoxItem:hover > a {
    color: #409eff;
  }

  .navItem:hover {
    color: #409eff;
  }

  .navItem .navSelectBoxItem {
    color: #ccc;
    line-height: 40px;
  }

  .navItem .navSelectBoxItem:hover {
    color: #409eff;
  }

  #nav .navActive {
    color: #409eff !important;
  }

  #nav a {
    color: #fff;
  }

  #nav .navSelectBoxItem a {
    color: #ccc;
  }
</style>
<style>
  .typeChangeLogo {
    width: .6rem;
    height: .6rem;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .login-container .el-input__inner {
    height: .4rem !important;
    padding: 0 .3rem;
    line-height: .4rem;
    font-size: .14rem;
    border-radius: .04rem;
  }

  .login-container .el-input__icon {
    width: .25rem;
    line-height: .4rem;
  }

  .loginBg .verificationText .el-input__inner {
    padding: 0 15px;
  }

  .login-container .el-form-item__content {
    line-height: .4rem;
    font-size: .14rem;
  }

  .haha:hover {
    color: #409eff;
  }

  #lwgs .el-form-item__error {
    padding-top: 0;
  }

  /*.login-container .el-input__inner{*/
  /*background-color: transparent;*/
  /*color: #fff;*/
  /*border: none;*/
  /*border-bottom: 1px solid#ccc;*/
  /*}*/
  .nc-container #nc_1_wrapper, .nc-container.tb-login #nc_1_wrapper {
    width: 3.7rem !important;
  }
  .nc-container #nc_2_wrapper, .nc-container.tb-login #nc_2_wrapper {
    width: 3.7rem !important;
  }

  .nc_scale {
    height: .4rem;
  }

  .nc-container .nc_scale span {
    width: .4rem;
    height: .4rem;
    line-height: .4px;
    box-sizing: border-box;
  }

  .nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang="_startTEXT"] {
    font-size: .16rem;
    height: .4rem;
    line-height: .4rem;
  }

  .nc_wrapper {
    width: 100% !important;
  }

  .nc-container .nc_scale .scale_text {
    line-height: .4rem;
    font-size: .12rem;
  }

  .nc_scale {
    height: .4rem;
    width: 100%;
  }
  .nc-container .nc_scale span {
    line-height: .4rem;
    height: .4rem;
    box-sizing: border-box;
  }

  .nc_iconfont {
    font-size: .16rem;
  }
  .nc-container .errloading {
    width: 3.7rem !important;
    box-sizing: border-box;
  }
  .nc-container .errloading {
    font-size: .12rem;
    text-indent: .03rem;
    line-height: .2rem;
    padding: .07rem .05rem .08rem .05rem;
  }
  iframe {
    width: 3.2rem !important;
  }
  #login_containerWX {
    width: 3.5rem;
    height: 3.5rem;
    overflow: hidden;
  }
</style>
