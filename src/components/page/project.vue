<template>
  <div id="project">
    <div class="selected">
      <ul>
        <li :class="{'navact':showState==0}" @click="changeState(0)">项目详情</li>
        <li :class="{'navact':showState==10}" v-if="states!=2" @click="changeState(10)">工程人员进场</li>
        <li :class="{'navact':showState==1}" v-if="states!=2" @click="changeState(1)">班组进/退场</li>
        <!--<li :class="{'navact':showState==2}" v-if="states!=2"  @click="changeState(2)" >工友进/退场</li>-->
        <li style="width: 1.2rem;" :class="{'navact':showState==9}" v-if="states!=2" @click="changeState(9)">工友进/退场</li>
        <li :class="{'navact':showState==3}" @click="changeState(3)">班组考勤</li>
        <li :class="{'navact':showState==4}" @click="changeState(4)">工友考勤</li>
        <li :class="{'navact':showState==5}" @click="changeState(5)">设备管理</li>
        <li :class="{'navact':showState==6}" @click="changeState(6)">项目通知</li>
        <!--<li :class="{'navact':showState==7}" @click="changeState(7)" >临时卡管理</li>-->
        <li :class="{'navact':showState==8}" @click="changeState(8)">进出记录</li>
      </ul>
    </div>
    <aa v-if="showState==0" :states="states" :formProject="formProject"></aa>
    <bb v-if="showState==1 && states!=2" @subBatchChange="subBatchChange" @subChange="subChange"
        :formProject="formProject"></bb>
    <cc v-if="showState==2 && states!=2" :formProject="formProject"></cc>
    <!--<batch v-if="showState==9 && states!=2"  :formProject="formProject"></batch>-->
    <ddd v-if="showState==3" :states="states" :formProject="formProject"></ddd>
    <ee v-if="showState==4" :states="states" :formProject="formProject"></ee>
    <ff v-if="showState==5" :states="states" :formProject="formProject"></ff>
    <good v-if="showState==6" :states="states" :formProject="formProject"></good>
    <!--<Temporary v-if="showState==7"  :states="states" :formProject="formProject"></Temporary>-->
    <inOut v-if="showState==8" :states="states" :formProject="formProject"></inOut>
    <batch v-if="showState==9" :states="states" :formProject="formProject"></batch>
    <projectInOut v-if="showState==10" :states="states" :formProject="formProject"></projectInOut>
  </div>
</template>
<script>
  import {
    getProjectById
  } from '../../api/projectapi'
  import {} from '../../api/api';
  import aa from '../project/projectContent.vue';
  import bb from '../project/Team.vue';
  import cc from '../project/workers.vue';
  import ddd from '../project/Teamcard.vue';
  import ee from '../project/workerscard.vue';
  import ff from '../project/Accesscontrol.vue';
  import good from '../project/projectnotice.vue';
  import Temporary from '../project/Temporarycard.vue';
  import inOut from '../project/inOut.vue';
  import batch from '../project/batchInOut.vue';
  import projectInOut from '../project/projectInOut.vue';

  export default {
    props: {
      //项目id
      project: {
        type: Object
      }
    },
    data() {
      return {
        showState: -1,
        projectId: '',
        formProject: {},
        states: 0
      }
    },
    components: {
      aa, bb, cc, ddd, ee, ff, good, Temporary, inOut, batch, projectInOut
    },
    mounted() {
      var _this = this;
      this.$root.eventHub.$on('idChange', value => {
        _this.projectId = value;
        _this.showState = 0;
        sessionStorage.setItem('showState', _this.showState);
        _this.getProject()
      });
      this.projectId = this.$route.query.id;
      this.getProject();
    },
    beforeDestroy() {
      this.$root.eventHub.$emit('projectName', '')
      sessionStorage.removeItem('showState');
    },
    methods: {
      subChange(data, index) {
        this.showState = index;
        window.localStorage.setItem('advanceTeamName', data.workteamname);   // 直接跳转到工友页面获取对应数据
        window.localStorage.setItem('advanceTeamId', data.id);   // 直接跳转到工友页面获取对应数据
      },
      subBatchChange(data, index) {
        this.showState = index;
        window.localStorage.setItem('advanceBatchTeamName', data.workteamname);   // 直接跳转到批量工友页面获取对应数据
        window.localStorage.setItem('advanceBatchTeamId', data.id);   // 直接跳转到工友页面获取对应数据
      },
      changeState(val) {
        window.localStorage.removeItem('advanceTeamName');   // 清空以免保存
        window.localStorage.removeItem('advanceTeamId');   // 清空以免保存
        window.localStorage.removeItem('advanceBatchTeamName');   // 直接跳转到工友页面获取对应数据
        window.localStorage.removeItem('advanceBatchTeamId');   // 直接跳转到工友页面获取对应数据
        this.showState = val;
        sessionStorage.setItem('showState', val);
      },
      getProject() {
        var self = this;
        var data = {
          projectId: this.projectId
        }
        getProjectById(data).then((res) => {
          if (res.data.code == 0) {
            self.formProject = res.data.data;
            self.states = res.data.data.states;
            this.$root.eventHub.$emit('projectName', self.formProject.name)
            if (sessionStorage.getItem("showState")) {
              this.showState = parseInt(sessionStorage.getItem("showState"))
            } else {
              this.showState = 0;
            }
          } else {
            this.$notify.error({
              title: '失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      }
    },
  }
</script>
<style scoped>
  #project {
  }

  .selected {
    padding-top: 10px;
  }

  .selected ul {
    overflow: hidden;
  }

  .selected li {
    float: left;
    width: 1rem;
    text-align: center;
    line-height: .4rem;
    border: .01rem solid #dcdfe6;
    color: #606266;
    box-sizing: border-box;
    outline: none;
    font-weight: 500;
    font-size: .14rem;
    cursor: pointer;
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .selected li:hover {
    color: #409EFF;
    border: .01rem solid #409EFF;
    border-bottom: none;
  }

  #project .navact {
    color: #409EFF;
    border: .01rem solid #409EFF;
    border-bottom: none;
  }
</style>
<style>

</style>
