<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm">
      <div class="title-container">
        <div class="logo">速酷物联</div>
      </div>
      <el-form-item prop="username" style="margin-top: 30px;">
        <input type="text" name="username" style="display:none" />
        <el-input
          ref="userNameInput"
          name="username"
          type="text"
          @keyup.enter.native="handleLogin"
          v-model.trim="loginForm.username"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <input type="password" name="password" style="display:none" />
        <el-input
          name="password"
          type="password"
          @keyup.enter.native="handleLogin"
          v-model.trim="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
       <el-form-item prop="captchaCode">
        <input type="text" name="captchaCode" style="display:none" />
        <el-row>
          <el-col :span="16" class="captcha-code-input">
            <el-input
              name="captchaCode"
              type="text"
              @keyup.enter.native="handleLogin"
              v-model.trim="loginForm.captchaCode"
              placeholder="请输入验证码"
            ></el-input>
          </el-col>
          <el-col :span="8" @click.native="getCaptchaSvg">
            <span style="cursor: pointer;" v-html="captchaSvg"></span>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="forget-password">
        <a style="display:none" @click="forgetPassword">忘记密码？</a>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import API from "@/api";
export default {
  name: "login",
  data() {
    return {
      // 表单model
      loginForm: {
        username: "youlan",
        password: "123456",
        captchaCode: ""
      },
      // 表单验证规则
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码"
          }
        ],
        captchaCode: [
          {
            required: true,
            message: "请输入验证码"
          }
        ]
      },
      captchaSvg: null,
      loading: false
    };
  },
  methods: {
    // 忘记密码弹框提示
    forgetPassword() {
      this.$alert("旧密码不正确，请联系系统管理员。", {
        confirmButtonText: "确定",
        lockScroll: false,
        center: true
      })
        .then(() => {})
        .catch(() => {});
    },
    // 登录成功跳转首页，失败用通知提示后端返回错误信息
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          this.$store
            .dispatch("Login", this.loginForm)
            .then(response => {
              this.loading = false;
              // this.$router.push({ path: "/" });
              if (response.code === 200) {
                this.$router.push({ path: "/" });
                // this.$emit('logSuccess')
              } else {
                this.$notify.error({
                  title: "错误",
                  message: response.msg
                });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getCaptchaSvg () {
      this.axios({
        method: "get",
        url: API.CAPTCHA.CAPTCHA_CODE
      }).then(res => {
        this.captchaSvg = res.data
      })
    }

  },
  mounted() {
    this.$refs.userNameInput.focus();
    this.getCaptchaSvg()
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100vh;
  min-height: 500px;
  min-width: 430px;
  background: #f1f7fc;
  // background: url('../../assets/login_bg.png') no-repeat;
  // background-size: cover;
  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2),
      0 26px 24px 0 rgba(12, 23, 44, 0.1);
    padding: 48px 80px 0;
    width: 430px;
    height: 500px;
    background: #fff;
    text-align: center;
    .title-container {
      .logo {
        width: 180px;
        // height: 135px;
        margin: 42px auto 90px;
        color: #409eff;
        font-style: italic;
        font-size: 42px;
        // background: url('../../assets/logo.png') no-repeat;
      }
    }
    .login-btn {
      width: 250px;
      height: 40px;
      background: #4890ea;
      font-size: 16px;
      color: #fff;
    }
    .forget-password {
      text-align: right;
      margin-bottom: 18px;
      a {
        font-size: 14px;
        color: #4890ea;
        text-decoration: none;
      }
    }
    .el-input {
        width: 100%;
      }
    .el-row{
        line-height: 46px;
      }
  }
  
}
</style>
