<template>
  <div class="wrapper">
    <v-head @majorProject="majorProject"  ref="header" :project="project"></v-head>
    <v-sidebar ref="slidebar" @sidebarIndex="sidebarIndex"></v-sidebar>
    <v-breadcrumb></v-breadcrumb>
    <div class="content" @click.stop="hiddenMenu">
      <transition name="move" mode="out-in">
        <router-view ref="dataStatistics" :project="project"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import vBreadcrumb from './Breadcrumb.vue';

  export default {
    data() {
      return {
        project: {
          projectId: ''
        }
      }
    },
    components: {
      vHead, vSidebar, vBreadcrumb
    },
    mounted() {
    },
    methods: {
      hiddenMenu() {
        if(this.$refs.slidebar.menuVisible == false) {
          return ;
        }
        this.$refs.header.activeIndex = window.localStorage.getItem('activeIndex');
        this.$refs.slidebar.closeMenu();
      },
      sidebarIndex(){
        this.$refs.header.activeIndex = 0;
        // this.$refs.slidebar.closeMenu();
      },
      majorProject () {
        this.$refs.dataStatistics.$children[0].projectList();
      }
    }
  }
</script>
