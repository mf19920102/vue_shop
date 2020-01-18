<template>
    <div>
        <el-button type="info" @click="loginout">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        loginout(){
            // 清空sessionstorage并跳转到login页面
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>

</style>