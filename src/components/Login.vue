<template>
  <div class="login_container">
    <!--登录框div-->
    <div class="login_box">
      <!--图片-->
      <div class="avator_box">
        <img src="../assets/logo.png" />
      </div>

      <!--登录表单区 ref="loginFormRef" 为表单实例对象-->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <!--用户名-->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      // 调用表单引用对象方法重置表单
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 提交时表单验证，loginRules中的验证都通过后valid的值为true，否则为false
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        // 登录接口
        // 把返回数据的data结构复制到resp中
        const {data:resp} =await this.$http.post('login',this.loginForm);
        if(200!=resp.meta.status){
            this.$message.error('登录失败');
            return;
        }
        this.$message.success('登录成功');
        // 保存token到sessionstorage中
        window.sessionStorage.setItem("token",resp.data.token);
        // 跳转到主页
        this.$router.push('/home')

      });
    }
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
