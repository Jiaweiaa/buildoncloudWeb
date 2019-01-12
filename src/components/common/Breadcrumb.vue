<template>
  <div class="branBox">
    <el-breadcrumb class="bran">
      <el-breadcrumb-item
        v-for="(item,index) in breadlist"
        :key='index'
        :to="item.path == '/branch-manager' || item.path == '/labour-company-manager' ? '': item.path">
        {{item.name}}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="projectName!=''">
        <span style="color: #606266">{{projectName}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        breadlist: [],
        projectName: ''
      }
    },
    created() {
      this.getBread();
    },
    mounted() {
      var self = this;
      this.$nextTick(function () {
        this.$root.eventHub.$on('projectName', function (val) {
          self.projectName = val;
        });
      })
    },
    methods: {
      getBread() {
        this.breadlist = [];
        this.breadlist.push(this.$route.matched[1]);
        this.breadlist.push(this.$route.matched[2]);
        if (this.$route.matched[3]) {
          this.breadlist.push(this.$route.matched[3]);
        }
        if (this.$route.path === '/workTeam-manager') {
          this.$root.eventHub.$emit('changeState', 0);
          window.localStorage.setItem('typeOfPage', 0);
        } else if (this.$route.path === '/worker-manager') {
          this.$root.eventHub.$emit('changeState', 0);
          window.localStorage.setItem('typeOfPagea', 0);
        } else if (this.$route.path === '/data-statistics') {
          this.$root.eventHub.$emit('changeState', 0);
          window.localStorage.setItem('dataTypeOfPage', 0);
        } else if (this.$route.path === '/labour-company-manager' || this.$route.path === '/manufacturer-manager' || this.$route.path === '/branch-manager' || this.$route.path === '/recruitment-information') {
          this.$root.eventHub.$emit('changeStatea', 0);
        }
      }
    },
    watch: {
      $route() {
        this.getBread();
      }
    }
  }
</script>
<style scoped>
  .branBox {
    position: relative;
    width: 100%;
    height: .3rem;
    z-index: 10;
    box-shadow: 0 .01rem .01rem .01rem #d6d6d6;
  }
  .bran {
    /*width: 100%;*/
    height: 100%;
    font-size: .12rem;
    overflow: hidden;
    position: absolute;
    /*left: 30px;*/
    /*top: 10px;*/
    line-height: .3rem;
    padding-left: .3rem;
    box-sizing: border-box;
  }

  .projectname {
    font-size: 12px;
    position: absolute;
    top: 57px;
    left: 240px;
  }
  /*@media screen and (min-width: 1920px){*/
    /*.branBox {*/
      /*position: relative;*/
      /*width: 100%;*/
      /*height: 30px;*/
      /*z-index: 10;*/
      /*box-shadow: 1px 1px 1px #d6d6d6;*/
    /*}*/
    /*.bran {*/
      /*!*width: 100%;*!*/
      /*height: 100%;*/
      /*font-size: 12px;*/
      /*overflow: hidden;*/
      /*position: absolute;*/
      /*!*left: 30px;*!*/
      /*!*top: 10px;*!*/
      /*line-height: 30px;*/
      /*padding-left: 30px;*/
      /*box-sizing: border-box;*/
    /*}*/

    /*.projectname {*/
      /*font-size: 12px;*/
      /*position: absolute;*/
      /*top: 57px;*/
      /*left: 240px;*/
    /*}*/
  /*}*/
</style>
