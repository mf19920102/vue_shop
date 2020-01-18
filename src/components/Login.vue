<template>
  <div class="login_container">
    <!--登录框div-->
    <div class="login_box">
      <!--图片-->
      <div class="avator_box">
        <img src="../assets/logo.png" />
      </div>

      <!--登录表单区-->
      <el-form class="login_form" :model="loginForm">
        <el-form-item>
          <!--用户名-->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item>
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 登录表单数据
      loginForm:{
          username:'',
          password:''
      }
    };
  }
  
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffff;
  // 圆角
  border-radius: 5px;
  position: absolute;
  // 居中
  left: 50%;
  top: 50%;
  // 横轴和纵轴各移动50%
  transform: translate(-50%, -50%);

  .avator_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    // 阴影
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    // 设置靠右对齐
    display: flex;
    justify-content: flex-end;
  }
}
</style>
