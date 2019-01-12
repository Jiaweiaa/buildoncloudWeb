<template>
  <div class="guide">
    <header class="guideHeader">
      <img class="logoSize" src="../../assets/rmzybjt.jpg"/>
      <div class="backHeader"></div>
      <div class="guideLogin">
        <img src="../../assets/buildoncloudlogo3.png" alt="login">
      </div>
      <h1>ID读卡器与摄像头安装指南</h1>
    </header>
    <div class="guideBody">
      <div id="guideSide" class="guideSide">
        <ul style="float: right">
          <li class="guideTitle">
            <h2>身份证读卡器使用说明</h2>
            <ul>
              <li class="smallHeader" @click="driver('driver')">
                <span>安装驱动</span>
              </li>
              <li class="smallHeader" @click="driver('join')">
                <span>接入设备</span>
              </li>
              <li class="smallHeader" @click="driver('message')">
                <span>读取信息</span>
              </li>
            </ul>
          </li>
          <li class="guideTitle">
            <h2>摄像头安装使用说明</h2>
            <ul>
              <li class="smallHeader" @click="driver('camera')">
                <span>接入摄像头</span>
              </li>
              <li class="smallHeader" @click="driver('config')">
                <span>配置摄像头</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="guideContent">
        <h2 id="driver">ZKIDROnline驱动安装</h2>
        <div class="operatingSteps">
          安装驱动文件 <span class="messageSpan">ZKIDROnline.exe</span>，安装后需要重启计算机
          <el-button type="text" icon="el-icon-download" @click="downloadFile">ZKIDROnline</el-button>

          <el-carousel height="250px" :autoplay="false" indicator-position="none" @change="changeStep">
            <el-carousel-item>
              <img src="../../../static/img/qdaz.png" alt="驱动安装" @click="alertImg(0)">
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/step1.png" alt="" @click="alertImg(1)">
                <div class="stepRight">
                  <ul>
                    <li>第一步打开下载好的文件夹(IDCard驱动和证书),安装驱动,点击 <span class="messageSpan">next</span>执行系一部,然后点击<span class="messageSpan">Install</span>进行安装,直到整个驱动安装完成,<span class="messageSpan">重新启动电脑</span></li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate0.png" alt="" @click="alertImg(2)">
                <div class="stepRight">
                  <ul>
                    <li>打开我的电脑,在我的电脑中打开网络的属性,选择<span class="messageSpan">Internet选项</span><br> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspwin7/8可以在控制菜单中找到Internet选项
                    </li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate1.png" alt="" @click="alertImg(3)">
                <div class="stepRight">
                  <ul>
                    <li>在Internet选项中找到内容选项卡,点击<span class="messageSpan">内容选项卡中的证书</span></li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate2.png" alt="" @click="alertImg(4)">
                <div class="stepRight">
                  <ul>
                    <li>然后点击证书中的<span class="messageSpan">导入</span>按钮</li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate3.png" alt="" @click="alertImg(5)">
                <div class="stepRight">
                  <ul>
                    <li>点击<span class="messageSpan">下一步</span></li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate4.png" alt="" @click="alertImg(6)">
                <div class="stepRight">
                  <ul>
                    <li>然后在证书导入向导中,导入指定的证书文件(<span class="messageSpan">在下载好的文件中找到---xmzkteco.local</span>),导入文件完成后执行<span
                      class="messageSpan">下一步</span></li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate5.png" alt="" @click="alertImg(7)">
                <div class="stepRight">
                  <ul>
                    <li>然后点击浏览,选择证书存储中的--<span class="messageSpan">受信任的根证书颁发机构</span>,点击确定,点击下一步完成证书认证</li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="step">
                <img src="../../../static/img/certificate6.png" alt="" @click="alertImg(8)">
                <div class="stepRight">
                  <ul>
                    <li>证书认证完成</li>
                  </ul>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div v-show="remindShow" class="remind" @click="remindShow = false">
            <p><span class="left"></span>点击按钮,查看驱动安装<span class="right"></span></p>
            <el-button type="text" style="background-color: rgba(0,0,0,0.0);position: absolute;right: 220px;bottom:90px" @click="remindShow = false">知道了</el-button>
          </div>
        </div>
        <div class="stepNum part"><span>{{activeIndex}}</span>/9</div>
        <h2 id="join">读卡器设备接入电脑</h2>
        <div class="operatingSteps part">
          重启后，将读卡器插入USB口，读卡器发出两声蜂鸣
        </div>
        <h2 id="message">读取身份证信息</h2>
        <div class="operatingSteps part">
          <p>将身份证放入到读卡器上<span class="messageSpan">点击读取身份证信息，在打开的控制台后（F12打开控制台），点击network再点击相应的接口查看headers中的链接</span></p>

          <img src="../../../static/img/dqxx-1.png" alt="驱动安装" style="margin-left: 30px" @click="alertImg1(0)">
        </div>
        <div class="operatingSteps part">
          在headers中查看链接进行复制<span class="messageSpan">在新的页面中放入链接进行打开</span>
          <img src="../../../static/img/dqxx-2.png" alt="驱动安装" style="margin-left: 30px" @click="alertImg1(1)">
        </div>
        <div class="operatingSteps part">
          在新打开的页面中<span class="messageSpan">点击高级选项</span>
          <img src="../../../static/img/dqxx-3.png" alt="驱动安装" style="margin-left: 30px" @click="alertImg1(2)">
        </div>
        <div class="operatingSteps part">
          然后在出现的提示中<span class="messageSpan">点击继续前往即可</span>
          <img src="../../../static/img/dqxx-4.png" alt="驱动安装" style="margin-left: 30px" @click="alertImg1(3)">
        </div>
        <div class="operatingSteps part">
          最后将身份证放入到读卡器上点击<span class="messageSpan">读取身份证信息</span>按钮
          <img src="../../../static/img/dqxx.png" alt="驱动安装" style="margin-left: 30px" @click="alertImg1(4)">
        </div>
        <h2 id="camera">接入摄像头</h2>
        <div class="operatingSteps part">
          接入摄像头 &nbsp&nbsp&nbsp<span class="messageSpan" style="font-size: 12px;color: #999999;">如果需要外接摄像头,按照如下步骤</span>
          <!--<img src="../../assets/qiye.png" alt="接入摄像头" style="margin-left: 30px">-->
        </div>
        <h2 id="config">浏览器配置摄像头</h2>
        <div class="operatingSteps">
          在浏览器中配置外接摄像头,增加用户体验
          <el-carousel height="250px" :autoplay="false" indicator-position="none" @change="configStep">
                <el-carousel-item>
              <img src="../../../static/img/camera1.png" alt="驱动安装" @click="alertImg2(0)">
            </el-carousel-item>
            <el-carousel-item>
              <img src="../../../static/img/camera2.png" alt="驱动安装" @click="alertImg2(1)">
            </el-carousel-item>
            <el-carousel-item>
              <img src="../../../static/img/camera3.png" alt="驱动安装" @click="alertImg2(2)">
            </el-carousel-item>
          </el-carousel>
          <div v-show="configShow" class="remind" @click="configShow = false">
            <p><span class="left"></span>点击按钮,查看外接摄像头配置<span class="right"></span></p>
            <el-button type="text" style="background-color: rgba(0,0,0,0.0);position: absolute;right: 220px;bottom:90px" @click="configShow = false">知道了</el-button>
          </div>
        </div>
        <div class="stepNum part" ><span>{{configIndex}}</span>/3</div>
      </div>
    </div>
    <el-button id="fixedButton" class="fixedButton" type="primary" icon="el-icon-caret-top" circle
               @click="topButton"></el-button>
    <div id="imgTitle" ref="imgTitle" v-if="imgArltBool">
       <img :src="ary[index]" ref="img" alt="">
       <span class="clonse" @click="imgArltBool = false">X</span>
       <div class="left" @click="cutImg(false)">
            <
       </div>
       <div class="right" @click="cutImg(true)">
            >
       </div>
       <div class="lens"><span class="lensSpen" @click="lensFn(true)">+</span><span class="lensSpen" @click="lensFn(false)">-</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "operationsGuide",
    data() {
      return {
        activeIndex: 1,
        configIndex:1,
        remindShow:true,
        configShow:true,
        name:null,
        imgArltBool:false,
        index:-1,
        ary:[],
        imgTitleAry_1:['../../../static/img/qdaz.png','../../../static/img/step1.png','../../../static/img/certificate0.png','../../../static/img/certificate1.png','../../../static/img/certificate2.png','../../../static/img/certificate3.png','../../../static/img/certificate4.png','../../../static/img/certificate5.png','../../../static/img/certificate6.png'],
        imgTitleAry_2:['../../../static/img/dqxx-1.png','../../../static/img/dqxx-2.png','../../../static/img/dqxx-3.png','../../../static/img/dqxx-4.png','../../../static/img/dqxx.png'],
        imgTitleAry_3:['../../../static/img/camera1.png','../../../static/img/camera2.png','../../../static/img/camera3.png']
      }
    },

    created() {
       // sessionStorage.setItem("nameCamera","camera");
       this.name = sessionStorage.getItem('nameCamera');
    },
    mounted() {
      this.guideFixed();
      if (this.name === "camera") {
        // document.getElementById("camera").scrollIntoView({behavior:"smooth",block:"start"});
        document.getElementById("camera").scrollIntoView();
        sessionStorage.removeItem("nameCamera");
      }
    },
    methods: {
      guideFixed() {
        window.onscroll = function () {
          //变量t是滚动条滚动时，距离顶部的距离
          var t = document.documentElement.scrollTop || document.body.scrollTop;
          var guideSide = document.getElementById('guideSide');
          var fixedButton = document.getElementById('fixedButton');
          //当滚动到距离顶部80px时，返回顶部的锚点显示
          if (t >= 80) {
            guideSide.style.position = "fixed";
            guideSide.style.top = "90px";
            guideSide.style.left = '0';
          } else {          //恢复正常
            guideSide.style.position = "relative";
            guideSide.style.top = "0";
            guideSide.style.left = '0';
          }

          if (t >= 10) {
            fixedButton.style.display = 'block';
          } else {
            fixedButton.style.display = 'none';
          }
        };
      },
      topButton() {
        $('html,body').animate({scrollTop: '0px'}, 300)
      },
      downloadFile() {
        window.open('"../../../static/身份证读卡器驱动和证书.zip', "驱动下载")
      },
      driver(name) {
        var driver = document.getElementById(name);
        $('html,body').animate({scrollTop: driver ? driver.offsetTop : 0 + 'px'}, 300)
      },
      changeStep(num) {
        this.activeIndex = num + 1
      },
      configStep(num){
        this.configIndex = num+1
      },
      alertImg (index) {
          this.index = index;
          this.imgArltBool = true;
          this.ary = this.imgTitleAry_1
      },
      alertImg1(index) {
          this.index = index;
          this.imgArltBool = true;
          this.ary = this.imgTitleAry_2
      },
      alertImg2(index) {
          this.index = index;
          this.imgArltBool = true;
          this.ary = this.imgTitleAry_3
      },
      lensFn(bool) {
          if (bool) {
              if (this.$refs.img.offsetHeight>this.$refs.imgTitle.offsetHeight-50) {
                this.$refs.img.style.height = this.$refs.imgTitle.offsetHeight+'px'
              } else {
                this.$refs.img.style.height = this.$refs.img.offsetHeight+50+'px'
              }
          } else {
              this.$refs.img.style.height = this.$refs.img.offsetHeight-50+'px'
          }


      },
      cutImg(bool) {
          this.$refs.img.style.height = 70+'%';
          if (bool) {
            ++this.index>this.ary.length-1?this.index=this.ary.length-1:this.index
          } else {
            --this.index<0?this.index=0:this.index
          }
      }
    },

  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
  }

  .guideHeader {
    position: relative;
    width: 100%;
    height: 150px;
    background-color: #ffffff;
  }

  .backHeader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 98;
  }

  .logoSize {
    position: absolute;
    top: 0;
    left: 0;
  }

  .guideHeader .guideLogin {
    position: absolute;
    width: 200px;
    left: 20px;
    top: 10px;
    background-color: rgba(0, 0, 0, 0);
    z-index: 99;
  }

  .guideLogin img {
    width: 100%;
    background-color: rgba(0, 0, 0, 0);

  }

  .guideHeader img {
    width: 100%;
    height: 100%;
  }

  .guideHeader h1 {
    position: absolute;
    right: 22%;
    top: 60px;
    color: #ffffff;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0);
    z-index: 99;
  }

  .guideBody {
    margin-top: 30px;
    width: 100%;
    height: auto;
    /*border: 1px solid orange;*/
    box-sizing: border-box;
    font-size: 0;
    overflow: hidden;
    user-select: none;
  }

  .guideBody .guideSide {
    display: inline-block;
    width: 30%;
    height: 100%;
    /*border: 1px solid red;*/
    box-sizing: border-box;
    vertical-align: top;
    font-size: 14px;
    overflow: hidden;
    text-align: right;
    /*position: fixed;*/
    /*transition: all .3s;*/
  }

  .guideBody .guideSide ul:nth-child(1) {
    width: 70%;
  }

  .guideBody .guideSide .guideTitle {
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .guideBody .guideSide .guideTitle h2 {
    font-size: 16px;
    color: rgb(44, 50, 68);
    border-right: 5px solid deepskyblue;
    padding-right: 5px;
    box-sizing: border-box;
  }

  .smallHeader {
    padding: 10px;
    font-size: 14px;
    box-sizing: border-box;
    transition: .3s all;
    cursor: pointer;
    user-focus: none;
    color: #999999;
    transition: all .3s;
  }

  .smallHeader span::before {
    display: inline-block;
    content: ' ';
    background-color: rgb(44, 50, 68);
    border-radius: 50%;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .smallHeader:hover span {
    border-bottom: 1px solid deepskyblue;
    box-sizing: border-box;
    padding-bottom: 5px;
    transition: .3s all;
  }

  .guideBody .guideContent {
    display: inline-block;
    width: 60%;
    height: 100%;
    /*border: 1px solid red;*/
    box-sizing: border-box;
    vertical-align: top;
    font-size: 14px;
    padding-left: 100px;
    float: right;
    margin-right: 10%;
  }

  .guideContent h2 {
    /*margin: 10px 0;*/
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    /*margin-top: 50px;*/
    /*margin-bottom: 50px;*/
  }

  .guideContent a {
    text-decoration: underline;
  }

  .operatingSteps {
    width: 100%;
    /*height: 300px;*/
    box-sizing: border-box;
    line-height: 25px;
    text-indent: 30px;
    color: #5e6267;
    position: relative;
  }

  .operatingSteps img {
    margin-top: 10px;
    width: 600px;
    height: 250px;
  }

  .fixedButton {
    display: none;
    position: fixed;
    right: 50px;
    bottom: 50px;
    background-color: #409EFF;
  }

  .step {
    width: 100%;
    height: 100%;
    /*border: 1px solid red;*/
    box-sizing: border-box;
    font-size: 0;
  }

  .step img {
    display: inline-block;
    width: 40%;
    height: 100%;
    margin-top: 0;
  }

  .stepRight {
    margin-top: 0;
    display: inline-block;
    width: 50%;
    height: 100%;
    /*border: 1px solid blue;*/
    box-sizing: border-box;
    font-size: 14px;
    vertical-align: top;
    font-weight: bold;
    color: #737373;
    padding: 10px;
  }

  .stepNum {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    text-align: right;
    /*padding-right: 40px;*/
    /*box-sizing: border-box;*/
    /*margin-bottom: 50px;*/
  }

  .stepNum span {
    color: deepskyblue;
  }

  .messageSpan {
    color: deepskyblue;
  }

  .remind {
    position: absolute;
    width: 100%;
    height: 250px;
    z-index: 99;
    background-color: rgba(0,0,0,0.6);
    color: #fff;
    bottom: 0;
    left: 0;
    font-size: 16px;
  }

  .remind p{
    position: absolute;
    font-size: 16px;
    color: #ffffff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto auto;
    width: 100%;
    height: 20px;
    background-color: rgba(0,0,0,0);
    text-align: center;
    line-height: 20px;
  }

  .remind p .left {
    position: absolute;
    top: -5px;
    left: 10px;
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px dashed deepskyblue;
    background-color: rgba(0,0,0,0);
  }

  .remind p .right {
    position: absolute;
    top: -5px;
    right: 10px;
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px dashed deepskyblue;
    background-color: rgba(0,0,0,0);
  }

  .part {
    margin-bottom: 25px;
    border-bottom: 1px dashed #cccccc;
    padding-bottom: 25px
  }
  #imgTitle {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      user-select: none;
  }
  #imgTitle img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* width: 70%; */
      height: 70%;
      display: block;
      margin: auto auto;
  }
  #imgTitle .clonse {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 15px;
      background: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
  }
  #imgTitle .left {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 40px;
      background-color: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      left: 10px;
      cursor: pointer;
      border-radius: 10px;
      padding: 0 5px;
  }
  #imgTitle .right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 40px;
      background-color: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      right: 10px;
      cursor: pointer;
      border-radius: 10px;
      padding: 0 5px;
  }
  .lens {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      /* width: 200px; */
      height: 50px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, .5);
      border-radius: 10px;
      width: 120px;
  }
  #imgTitle .lens .lensSpen {
      float: left;
      color:#ffffff;
      font-size: 40px;
      background-color: rgba(0, 0, 0, 0);
      padding: 0 10px;
      box-sizing: border-box;
      cursor: pointer;
      width: 50%;
      line-height: 50px;
      padding: 0 10px;
      text-align: center;
  }
  #imgTitle .lens .lensSpen:hover{
      background-color: rgba(0, 0, 0, .1);
  }
</style>

<style>
  .el-carousel__container .el-carousel__arrow {
    background-color: deepskyblue;
  }

  .el-carousel__container .el-carousel__arrow:hover {
    background-color: #00e5ff;
  }
</style>
