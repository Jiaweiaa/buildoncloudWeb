<template>
  <div class="header">
    <div class="logo">
      <img src="../../assets/cloudlog.png" style="width: 100%; "/>
    </div>
    <!--
        导航栏
    -->
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#2c3244" text-color="#969db0"
             active-text-color="#fff">
      <el-menu-item style="height: 80px; padding: 10px 0" :index="index == activeIndex? ''+ index : ''+ index "
                    v-for="(item, index) in listData"
                    @click="menuChange(item.buttons, index, item)">
        <span class="menuText">{{item.aliasName}}</span>
      </el-menu-item>
    </el-menu>

    <!--
        通知
    -->
    <el-badge :value='this.notificaMsgLength' :max="99" class="itemDD animated" :class="showAn? 'flash':''">
      <i class="el-icon-bell selfIcon" @click.stop="notification"></i>
    </el-badge>


    <!--
        操作栏
    -->
    <div class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
           <i class="el-icon-question sizeStyle"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            如有问题请email:business@buildoncloud.cn
          </el-dropdown-item>
          <el-dropdown-item >
            <a href="javascript:;" @click="historyMessage" style="display: block;text-decoration: none;color: #188AFE;">查看版本更新详情</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{this.adminData.username}}
                </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="passwordChange">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--
          所属公司
      -->
    <el-select
      v-show="comanyBok"
      v-model="project.projectId"
      size="small"
      @change="projectChange"
      placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>


    <!--
        修改密码弹出层
    -->
    <el-dialog title="密码修改" class="here" append-to-body :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rulesform" ref="form">
        <el-form-item label="旧密码" prop="old">
          <el-input :type="this.oldPassType" v-model="form.old" auto-complete="off" style="float: right; width: 84%;">
            <i class="el-icon-view el-input__icon"
               style="width: 40px; cursor: pointer;"
               slot="suffix"
               @click="seeOldPass">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input :type="this.newPassType" v-model="form.new" auto-complete="off" style="float: right; width: 84%;">
            <i class="el-icon-view el-input__icon"
               style="width: 40px; cursor: pointer;"
               slot="suffix"
               @click="seeNewPass">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="bijiaoPass">
          <el-input :type="passType" v-model="form.bijiaoPass" auto-complete="off" style="float: right; width: 84%;">
            <i class="el-icon-view el-input__icon"
               style="width: 40px; cursor: pointer;"
               slot="suffix"
               @click="seePass">
            </i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="pass('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!--
        通知菜单
    -->
    <transition enter-active-class="slideInRight" leave-active-class="slideOutRight" v-on:before-enter="beforeEnter">
      <div class="notifica animated" v-show="notificaDialogVisible" animate-delay="0s" animate-duration="0.5s">
        <div class="title">通知<i class="el-icon-close" @click="cancelNotifica"></i><span class="readAll"
                                                                                        @click="readALl">全部已读</span>
        </div>
        <p class="tabs">
                    <span :class="{active:actIndex==0}" class="file" @click="NotiClick(0)">未读
                        <span class="iconT" v-show="filShow"></span>
                    </span>
          <span :class="{active:actIndex==1}" class="tagging" @click="NotiClick(1)">已读
                        <span class="iconT" v-show="tagShow"></span>
                    </span>
        </p>
        <div class="scrollMoreStyle">
          <div v-show="noDataBok == false" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
               infinite-scroll-distance="10">
            <div class="ListDataBox" v-for="(item, index) in nowUnReadData" @click="lookThis(item)">
              <p class="ListTitle">{{item.systemNotification ? item.systemNotification.title : ''}}</p>
              <p class="ListNote">{{item.systemNotification ? item.systemNotification.content : ''}}</p>
              <p class="ListTime">{{item.opAt}}</p>
            </div>
            <div class="footerDataBox">
              <i v-show="loadMaxMore == false" class="footerIcon el-icon-loading"></i>
              <div v-show="loadMaxMore == true" class="footerText">全部加载完成</div>
            </div>
          </div>
          <div style=" position: relative; top: 50%; margin-top: -50%;" v-show="noDataBok == true">
            <img class="noDataStyle" src="../../assets/noData.png"/>
            <p class="noDataStyleMsg">没有通知</p>
          </div>
        </div>
      </div>
    </transition>

    <!--
       历史版本
    -->
    <el-dialog
      title="版本更新详情"
      :visible.sync="historyMessageBool"
      width="70%"
      class="here_01"
      append-to-body
      center
      >
      <!--<span>这是一段信息</span>-->
      <div class="historyMessage">
         <ul>
           <li>
             <h3>版本号:V1.2.2 <span>发布时间:2019-01-09</span></h3>
             <h5>本次更新的内容:</h5>
             <p>1.新增微信第三方登录</p>
             <p>2.新增反馈列表</p>
             <p>3.新增反馈信息列表功能和短信群发功能</p>
             <p>4.修改工人人脸对比BUG</p>
           </li>
         </ul>
      </div>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="historyMessageBool = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    loginOut,
    getUserCompany,
    getAdmin,
    getMenu,
    forgetPassWord,
    topBranchList,
    noInfornationList,
    readInfornation,
    infornationCount
  } from '../../api/api';

  import {
    projectList
  } from '../../api/projectapi';

  export default {
    props: {
      //项目id
      project: {
        type: Object
      }
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.bijiaoPass !== '') {
            this.$refs.form.validateField('bijiaoPass');
          }
          var reg = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}/;
          if (!reg.test(value)) {
            callback(new Error('密码不能少于6位或多于12位'));
          } else {
            callback();
          }
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (!value) {
          value = ''
        }
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.new) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        nowIndex: '',
        //公司是否显示
        comanyBok: true,

        // 没数据
        noDataBok: true,
        // 开始
        loadMaxMore: false,
        // 页数计数
        noPageNum: 1,
        maxPageNum: '',

        // 加载开关
        busy: false,
        // 未读标记
        filShow: false,
        // 已读标记
        tagShow: false,
        // 选中状态
        actIndex: 0,
        // 未读消息条数
        notificaMsgLength: 0,
        // 弹层开关
        notificaDialogVisible: false,
        // 开关
        showAn: false,
        // 二级菜单列表
        listData: [],

        adminData: '',

        // 输入框状态类
        passType: 'password',
        oldPassType: 'password',
        newPassType: 'password',


        name: 'linxin',
        activeIndex: 0,
        options: [],

        rulesform: {
          old: [
            {required: true, message: '旧密码不能为空', trigger: 'blur'}
          ],
          new: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          bijiaoPass: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        form: {
          old: '',
          new: '',
          bijiaoPass: ''
        },

        // 未读数据
        nowUnReadData: [],

        itemMenuChild: [],

        historyMessageBool:false,
      }
    },
    computed: {
      username() {
        let username = localStorage.getItem('ms_username');
        return username ? username : this.name;
      }
    },
    created() {
      if (window.localStorage.getItem('activeIndex')) {
        this.activeIndex = window.localStorage.getItem('activeIndex');
      } else {
        this.activeIndex = 0;
        window.localStorage.setItem('activeIndex', this.activeIndex);
      }

      this.$root.eventHub.$on('isProjectDoit', value => {
        this.activeIndex = 1;
      })
      this.$root.eventHub.$on('getMenuList', value => {
        var parmas = {
          pageSize: 999
        }
        projectList(parmas).then((res) => {
          this.$root.eventHub.$emit('ChildMenu', res.data.data.list);
          this.$root.eventHub.$emit('isProjectList', true);
        })
      });
      // 获取公司列表
      this.getMenuList();
      this.getCompany();
      this.getAdminData();
      this.getCount();
    },
    methods: {
      historyMessage() {
        this.historyMessageBool = true;
      },
      menuChange(item, index, data) {
        this.activeIndex = index;
        // 临时存的 当你点击左侧切换之后顶部拿到的
        window.localStorage.setItem('linshiIndex', this.activeIndex);   // 设置本地缓存列表
        this.$root.eventHub.$emit('menuTitle', data.aliasName);
        if (this.nowIndex == index && this.nowIndex !== '' && this.nowIndex !== 0) {
          this.$root.eventHub.$emit('sameClick', true);
          return;
        } else {
          this.$root.eventHub.$emit('sameClick', false);
        }
        if (item.length > 0) {
          this.nowIndex = index;
          this.$root.eventHub.$emit('isProjectList', false);
          this.$root.eventHub.$emit('ChildMenu', item);
          var arrAli = [];
          var arrName = [];
          for (var i = 0; i < item.length; i++) {
            arrAli.push(item[i].aliasName);
            arrName.push(item[i].name);
          }
          var strArrAli = arrAli.toString();
          var strArrName = arrName.toString();
          window.localStorage.setItem('strArrAli', strArrAli);   // 设置本地缓存列表
          window.localStorage.setItem('strArrName', strArrName);   // 设置本地缓存列表
          this.$root.eventHub.$emit('isProjectList', false);
          window.localStorage.setItem('activeIndexNow', '');

        } else {
          this.nowIndex = index;
          if(data.aliasName =='总览') {
            window.localStorage.setItem('activeIndex', 0);
          }
          if (data.aliasName == '项目管理') {
            var parmas = {
              pageSize: 999
            }
            projectList(parmas).then((res) => {
              this.$root.eventHub.$emit('ChildMenu', res.data.data.list);
              this.$root.eventHub.$emit('isProjectList', true);
            })
          } else {
            window.localStorage.setItem('activeIndexNow', '');
            this.$router.push('/' + data.name);
            this.$root.eventHub.$emit('ChildMenu', item);
            this.$root.eventHub.$emit('isProjectList', false);
          }
        }
      },

      getRouter() {
        if (this.$route.path == '/equipment-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/manufacturer-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/branch-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/project-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else if (this.$route.path == '/worker-type-manager') {
          this.comanyBok = false;
          window.localStorage.setItem('isShowCompany', '0');
        } else {
          this.comanyBok = true;
          window.localStorage.setItem('isShowCompany', '1');
        }
      },
      // 获取所有未读条数
      getCount() {
        infornationCount().then((res) => {
          if (res.data.code == 0) {
            this.notificaMsgLength = res.data.data;
            if (this.notificaMsgLength > 0) {
              this.showAn = true;
            }
          }
        })
      },
      // 列表获取
      NotiClick(index) {
        this.actIndex = index;
        this.noPageNum = 1;
        this.nowUnReadData = [];
        var parmas = {
          readed: this.actIndex
        }
        this.getInforList(parmas);
      },
      // 获取未读数据
      getInforList(parmas) {
        noInfornationList(parmas).then((res) => {
          if (res.data.data.list.length === 0) {
            this.noDataBok = true;
          } else {
            this.noDataBok = false;
            this.nowUnReadData = res.data.data.list;
            for (var i = 0; i < this.nowUnReadData.length; i++) {
              this.nowUnReadData[i].opAt = this.getMyDate(this.nowUnReadData[i].opAt * 1000).substr(0, 10)
            }
            this.maxPageNum = res.data.data.maxPage;
          }
        })
      },
      // 动画
      beforeEnter(el) {
        var delay = el.getAttribute('animate-delay'),
          duration = el.getAttribute('animate-duration');
        var cssObj = {
          "animation-delay": delay,
          "-webkit-animation-delay": delay,
          "animation-duration": duration,
          "-webkit-animation-duration": duration,
          "visibility": "visible"
        }
        var getCssText = function (obj) {
          var text = [];
          for (var o in obj) {
            text.push(o + ":" + obj[o])
          }
          return text.join(';')
        }
        el.style.cssText = getCssText(cssObj);
      },
      // 查看一条
      lookThis(item) {
        if (this.actIndex == 0) {
          var parmas = {
            ids: item.id
          }
          readInfornation(parmas).then((res) => {
            if (res.data.code == 0) {
              var parmas = {
                readed: this.actIndex
              }
              this.getInforList(parmas);
            }
          })
        }
      },
      // 全部已读
      readALl() {
        var par = {
          'ids': 'all'
        }
        readInfornation(par).then((res) => {
          if (res.data.code == 0) {
            this.getCount();
            this.notificaDialogVisible = false;
          }
        })
      },
      // 关闭未读弹层
      cancelNotifica() {
        this.getCount();
        this.notificaDialogVisible = false;
      },
      // 点击阅读函数
      notification() {
        var parmas = {
          readed: this.actIndex
        }
        this.getInforList(parmas);
        this.notificaDialogVisible = true;
      },
      // 加载更多
      loadMore() {
        this.$nextTick(() => {
          this.busy = true;
          var parmas = {
            pageNo: this.noPageNum,
            readed: this.actIndex
          }
          if (this.noPageNum > this.maxPageNum) {
            this.loadMaxMore = true;
          } else {
            this.loadMaxMore = false;
            if (parmas.pageNo == 1) {
              this.noPageNum++;
            }
            this.contactData(parmas);
          }
          this.busy = false;
        })
      },
      // 数据链接
      contactData(parmas) {
        noInfornationList(parmas).then((res) => {
          for (var i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].opAt = this.getMyDate(res.data.data.list[i].opAt * 1000).substr(0, 10)
          }
          this.nowUnReadData = this.nowUnReadData.concat(res.data.data.list);
        })
        this.noPageNum++;

      },

      // 下拉框缓存
      projectChange(val) {
        window.localStorage.setItem('companyIdNow', val);   // 设置权限公司缓存
        this.$emit('majorProject')
      },

      // 获取菜单列表
      getMenuList() {
        getMenu().then((res) => {
          this.listData = res.data.data;
        })
      },

      //获取登陆信息
      getAdminData() {
        getAdmin().then((res) => {
          if (res.data.code == 0) {
            this.adminData = res.data.data;
          }
        })
      },

      // 获取公司列表
      getCompany() {
        var self = this;
        topBranchList().then((res) => {
          if (!res) {
            return;
          }
          var arr = res.data.data;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == 0) {
              arr[i].id = '';
            }

          }
          self.options = arr;
          if (arr.length == 1) {
            self.project.projectId = arr[0].id
          }

        })
      },

      // 操作栏
      handleCommand(command) {
        if (command == 'loginout') {
          loginOut().then((res) => {
            this.$router.push('/login');
            // this.$message({
            //   message: res.data.msg,
            //   type: 'success'
            // });
            this.$notify.success({
              title:res.data.msg,
              // offset: 100
            });
          })
        } else if (command == 'passwordChange') {
          this.dialogFormVisible = true;
        }
      },

      // 点击显示password或者text
      seePass() {
        if (this.passType == 'password') {
          this.passType = 'text';
        } else {
          this.passType = 'password';
        }
      },
      seeNewPass() {
        if (this.newPassType == 'password') {
          this.newPassType = 'text';
        } else {
          this.newPassType = 'password';
        }
      },
      seeOldPass() {
        if (this.oldPassType == 'password') {
          this.oldPassType = 'text';
        } else {
          this.oldPassType = 'password';
        }
      },
      pass() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            var parmas = Object.assign({}, this.form);
            forgetPassWord(parmas).then((res) => {
              if (res.data.code == 0) {
                this.$router.push('/login');
                this.$refs.form.resetFields();
                this.$notify.success({
                  title: '修改成功,请重新登陆',
                  // message: res.data.msg,
                  // offset: 100
                });
                this.$refs.form.resetFields();
              } else {
                this.$notify.error({
                  title: '修改失败',
                  message: res.data.msg,
                  offset: 100
                });
              }
            })
          }
        });
      },
      cancel() {
        this.dialogFormVisible = false
        this.$refs.form.resetFields();
      },
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
    },
    watch: {
      $route() {
        this.getRouter();
      }
    }
  }
</script>
<style>
  .header .el-menu {
    border: none;
  }

  .header .el-menu-vertical-demo {
    width: 5rem;
    height: 100%;
    overflow: hidden;
    float: left;
  }

  .header .el-menu-vertical-demo li {
    width: 1rem;
    float: left;
    height: .45rem !important;
    line-height: .45rem;
    padding: 0 !important;
    text-align: center;
    font-size: .14rem;
  }

  .header .el-radio__label {
    font-size: 13px;
  }

  .header .user-info .el-dropdown-link {
    right: .2rem;
  }

  .header .el-table .cell {
    height: 30px;
    line-height: 30px;
  }

  #app {
    color: #5C6471;
  }

  .header .el-dropdown-menu {
    top: 50px !important;
  }

  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: .45rem;
    font-size: .22rem;
    line-height: .45rem;
    color: #fff;
    background: rgb(44, 50, 68);
    z-index: 999;
  }

  .header .logo {
    float: left;
    width: 1rem;
    text-align: center;
    margin: .03rem 0 0 .05rem;
  }

  .header .user-info {
    float: right;
    font-size: .16rem;
    color: #fff;
    margin-left: .3rem;
  }

  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: .1rem;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
    line-height: .45rem;
  }

  .user-info .user-logo {
    position: absolute;
    left: 0;
    top: 0px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

  .el-dropdown {
    font-size: .14rem;
  }

  .el-menu-demo {
    width: 1000px;
    border-bottom: none;
    position: absolute;
    top: 0;
  }

  .header .childMenu {
    width: 500px;
    left: 50%;
    height: 100%;
    position: absolute;
    margin-left: -300px;
  }

  .header .activeClass {
    color: #2993f5;
    border-bottom: 2px solid #2993f5;
  }

  .el-input__inner {
    padding: 0 .1rem;
  }

  .el-input--small .el-input__inner {
    height: .32rem;
    line-height: .32rem;
    font-size: .14rem;
  }

  .el-select-dropdown__item {
    font-size: .14rem;
    padding: 0 .2rem;
    height: .34rem;
    line-height: .34rem;
  }

  .el-select-dropdown__list {
    padding: .06rem 0;
    font-size: .12rem;
  }

  .el-form-item {
    margin-bottom: 15px !important;
  }

  .el-form-item__error {
    top: 96%;
  }

  .el-dialog {
    width: 46%;
    border-radius: 5px;
    position: relative;
  }

  .el-dialog__header {
    background: #515151;
    padding: .1rem .15rem .1rem;
    border-radius: .05rem .05rem 0 0;
    height: .3rem;
  }

  .el-dialog__title {
    color: #fff;
    font-size: .16rem;
    position: absolute;
    top: .1rem;
  }

  .el-dialog {
    border-radius: 5px !important;
  }

  .el-dialog__body {
    padding: .15rem .2rem 0;
  }

  .el-table {
    font-size: .12rem;
    color: #5C6471;
  }

  .el-table th {
    background: #EFF2F7 !important;
  }

  .el-message-box__header {
    background: #515151;
    border-radius: 5px 5px 0 0;
  }

  .el-message-box {
    border: none;
    border-radius: 5px;
  }

  .el-message-box__title {
    color: #fff;
  }

  .pageCurrent {
    right: 0 !important;
  }

  .el-button--medium {
    font-size: .12rem;
    padding: .1rem .15rem;
  }

  .search p {
    font-size: .12rem !important;
  }

  .el-button--small {
    padding: .08rem .1rem;
    font-size: .12rem;
  }

  .el-dialog__body {
    font-size: .12rem;
  }

  .el-form-item__label {
    font-size: .12rem;
    color: #5C6471 !important;
  }

  .el-form-item__content {
    font-size: .14rem;
    line-height: .4rem;
  }

  .el-form-item--small .el-form-item__content {
    /*line-height: .32rem;*/
  }

  .el-table td, .el-table th {
    padding: .05rem 0;
  }
  .el-table .cell, .el-table th div{
    padding-right:.1rem ;
  }

  .el-button--text {
    padding: 8px 5px !important;
  }

  .el-table .cell{
    line-height: .3rem;
  }

  .el-textarea {
    vertical-align: middle !important;
  }

  .btn {
    border-radius: 5px !important;
    margin-bottom: 10px !important;
  }

  .el-checkbox__label {
    font-size: 12px;
  }

  .here .el-dialog__header {
    height: .3rem;
    line-height: .3rem;
    font-size: .14rem;
    font-weight: normal
  }

  .here .el-dialog__footer {
    padding: 0 20px 0 0;
    height: 50px;
    line-height: 30px;
    font-size: 0rem;
  }

  .here_01 .el-dialog__header {
    height: .3rem;
    line-height: .3rem;
    font-size: .14rem;
    font-weight: normal
  }

  .here_01 .el-dialog__footer {
    padding: 0 20px 0 0;
    height: 50px;
    line-height: 30px;
    font-size: 0rem;
  }

  .el-dialog__headerbtn {
    position: absolute;
    top: 13px;
  }

  .el-button + .el-button {
    margin-left: .1rem;
  }

  .el-textarea__inner {
    padding: 5px 10px;
  }

  .lookFormFindStyle .el-form-item {
    margin-bottom: 0 !important;
  }

  .lookFormFindStyle .el-select .el-input.is-disabled .el-input__inner {
    border: none;
    background: #fff;
    color: #5C6471;
    padding: 0;
  }

  .lookFormFindStyle .el-input__suffix {
    display: none;
  }

  .lookFormFindStyle .el-select {
    width: 40px;
  }

  .lookFormFindStyle .el-input.is-disabled .el-input__inner {
    border: none;
    background: #fff;
    color: #5C6471;
    padding: 0;
  }

  .lookStyleForDiv .el-input.is-disabled .el-input__inner {
    border: none;
    background: #fff;
    color: #5C6471 !important;
    padding: 0;
  }

  .lookStyleForDiv .data {
    font-size: 12px;
    color: #5C6471;
  }

  .lookStyleForDiv .el-textarea.is-disabled .el-textarea__inner {
    color: #5C6471;
  }

  .header .el-badge__content.is-fixed {
    top: .1rem;
    background: red;
    height: .16rem;
    border: none;
    line-height: .16rem;
  }
  .el-badge__content {
    border-radius: .1rem;
    font-size:.12rem;
    padding: 0 .06rem;
  }

  .el-pagination .el-select .el-input .el-input__inner {
    line-height: 28px;
  }

  .el-pagination__editor.el-input .el-input__inner {
    line-height: 28px;
  }

  .inoutbox .cell {
    height: auto !important;
    line-height: normal !important;
  }

  .textareaOverflow .el-textarea__inner {
    overflow: hidden;
  }

  .el-message-box__header {
    padding: .15rem .15rem .2rem;
  }
  .el-message-box {
    width: 4.2rem;
  }
  .here_01 .el-dialog__header .el-dialog__title {
    transform: translateX(-50%) !important;
  }
</style>
<style scoped>
  .itemDD {
    float: right;
    height: .44rem;
    line-height: .44rem;
    cursor: pointer;
    margin-right: .20rem;
  }

  .selfIcon {
    height: .42rem;
    color: #fff;
    margin-top: .03rem;
  }

  .notifica {
    width: 3.5rem;
    position: fixed;
    right: 0;
    height: 100%;
    background: rgb(246, 246, 246);
    z-index: 99999;
  }

  .buttonSelf {
    background: #fa7a2a;
    border: none;
    padding: 0 15px;
    height: 28px;
    border-radius: 15px;
    margin-right: 20px;
    margin-top: 20px;
  }

  .notifica .title {
    width: 100%;
    font-size: .2rem;
    font-weight: bold;
    text-align: center;
    color: #242f42;
    position: relative;
  }

  .notifica .tabs {
    color: #4f4f4f;
    width: 100%;
    font-size: .16rem;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
  }

  .notifica .tabs span {
    display: block;
    width: 50%;
    height: .6rem;
    line-height: .6rem;
    float: left;
    text-align: center;
    position: relative;
    cursor: pointer;
  }

  .notifica .tabs span .iconT {
    width: .05rem;
    height: .05rem;
    background: #fa7a2a;
    border-radius: 50%;
    position: absolute;
    right: 16%;
    top: 30%;
  }

  .header .el-icon-close {
    position: absolute;
    right: .2rem;
    color: #999;
    top: 50%;
    margin-top: -8px;
    cursor: pointer;
  }

  .header .el-badge__content {
    border: none !important;
    top: .13rem !important;
    right: .2rem !important;
    background: #409EFF !important;
    padding: 0 .05rem !important;
    height: .16rem !important;
    line-height: ,16rem !important;
  }

  .header .avatar {
    width: 2rem;
    height: 2rem;
    display: block;
  }

  .header .el-upload--text {
    width: 2rem;
    height: 2rem;
  }

  .header .avatar-uploader-icon {
    width: 200px;
    height: 200px;
    line-height: 200px;
  }

  .notifica .active {
    color: #242f42;
    border-bottom: 2px solid #409EFF;
  }

  .notifica .ListDataBox {
    color: #000;
    font-size: 12px;
    width: 100%;
    border: 1px solid #eee;
    position: relative;
    cursor: pointer;
  }

  .notifica .ListDataBox .ListNote {
    max-width: 350px;
    line-height: normal;
    margin-left: 8%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .notifica .ListDataBox .ListTitle {
    width: 100px;
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    margin-top: 20px;
    margin-left: 8%;
  }

  .notifica .ListDataBox .ListTime {
    position: absolute;
    right: 15px;
    top: 8px;
  }

  .notifica .ListDataBox .buttonSelf {
    position: absolute;
    height: 20px;
    line-height: 20px;
    bottom: 25px;
    right: 20px;
  }

  .ps__scrollbar-y-rail {
    z-index: 999;
  }

  .notifica .readAll {
    font-size: .12rem;
    position: absolute;
    left: 5%;
    top: .05rem;
    color: #409EFF;
    cursor: pointer;
  }

  .scrollMoreStyle {
    height: calc(100% - 123px);
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .footerIcon {
    text-align: center;
    width: 100%;
    display: block;
    color: #000;
    margin-top: 5px;
  }

  .footerText {
    font-size: 12px;
    width: 100%;
    text-align: center;
    color: #000;
  }

  .noDataStyle {
    display: block;
    width: 80%;
    margin: 0 auto;
  }

  .noDataStyleMsg {
    color: #000;
    width: 100%;
    text-align: center;
    font-size: .14rem;
  }

  .sizeStyle {
    font-size: .18rem;
  }

  .el-input--small .el-input__icon {
    line-height: .32rem !important;
  }

  .el-button{
    font-size: .14rem;
  }
  .el-select-dropdown__empty {
    padding: .1rem 0;
    font-size: .14rem;
  }

  .el-range-editor--small.el-input__inner {
    height: .32rem !important;
    line-height: .32rem;
  }
  .el-range-editor--small .el-range__icon {
    line-height: .24rem;
  }
  .el-range-editor--small .el-range-separatorv {
    font-size: .13rem !important;
    line-height: .24rem !important;
  }
  .el-date-editor .el-range-separator {
    padding: 0 .05rem;
    font-size: .13rem;
    line-height: .24rem;
  }

  .header .el-select {
    width: 2rem;
    float: right;
    font-size: 0.16rem;
  }
  .historyMessage {
    width: 100%;
    min-height:200px;
  }

  .historyMessage ul {
    list-style: none;
  }
  .historyMessage ul li {
    width: 100%;
    margin: 20px auto;
  }
  .historyMessage ul li h3 {
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #ebebeb;
    font-size: 17px;
  }
  .historyMessage ul li h3 span {
    display: inline-block;
    line-height: 1;
    vertical-align: bottom;
    float: right;
    font-size: 14px;
  }

  .historyMessage ul li h5 {
    font-size: 14px;
    line-height: 20px;
    padding: 10px;
    box-sizing: border-box;
  }
  .historyMessage ul li p {
    font-size: 13px;
    line-height: 5px;
    padding: 10px;
    box-sizing: border-box;
  }

</style>
