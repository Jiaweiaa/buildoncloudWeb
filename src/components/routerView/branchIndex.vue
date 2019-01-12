<template>
    <div>
        <router-view :project="project"></router-view>
    </div>
</template>

<script>
    export default {
        props:{
            //项目id
            project:{
                type:Object
            }
        },
        data() {
            return {}
        },


        components: {},
        methods: {}
    }
</script>
<style scoped>

</style>
