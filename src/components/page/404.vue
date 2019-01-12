<template>
    <div style="position: relative; background: #fff; width: 100%; height: 100%;">
        <div style="position: absolute; left: 50%; top: 50%; margin-left: -400px; margin-top: -300px; width: 800px; height: 600px;">
            <img src="../../assets/404.jpg"/>
            <p style="width: 100%; text-align: center; font-size: 13px;">抱歉,页面走丢了..... <span style="color:orange; cursor: pointer;" @click="goLogin">点击这里</span> 返回首页</p>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            goLogin() {
                this.$router.push('/login')
            }
        }
    }
</script>
<style>
</style>
