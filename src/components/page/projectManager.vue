<template>
  <div id="projectManager">
    <router-view :project="project"></router-view>
  </div>
</template>
<script>
  import {} from '../../api/projectapi'
  import {} from '../../api/api';

  export default {
    props: {
      //项目id
      project: {
        type: Object
      }
    }
  }
</script>
<style>

</style>
