<template>
  <div>
    <el-menu
      class="navbar"
      mode="horizontal"
      :class="{'navbarDataAnalysis': $route.path === '/dataanalysis/index'}"
    >
      <hamburger
        class="hamburger-container"
        :toggleClick="toggleSideBar"
        :isActive="sidebar.opened"
      ></hamburger>
      <span class="title">物联卡平台</span>
      <el-dropdown @command="handleCommand" class="current-user" trigger="click">
        <div class="user-info">
          <img
            v-if="user.userLogo"
            :src="host + user.userLogo + '?scale=0.8&quality=0.5'"
            width="40"
            height="40"
          />
          <img v-else src="../../../assets/avatar.png" width="40" height="40" />
          <span>{{loginUsername}}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <modify-pwd :dialogVisible="dialogVisible" @close="close" :userId="userId" :username="username"></modify-pwd>
  </div>
</template>

<script>
import GLOBAL from "../../../utils/global";
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ModifyPwd from "@/components/ModifyPwd";

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    ModifyPwd
  },
  data() {
    return {
      host: GLOBAL.HOST,
      user: {},
      dialogVisible: false,
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem('userInfo')).id;
    },
    loginUsername() {
      return JSON.parse(localStorage.getItem('userInfo')).name;
    },
    username() {
      return JSON.parse(localStorage.getItem('userInfo')).username;
    },
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    close(type) {
      this.dialogVisible = false;
      if (type === 'cancel') return;
      this.$message({
        showClose: true,
        message: '密码已修改，将自动跳转到登录页',
        type: 'warning',
        onClose: () => {
          this.logout();
        }
      });
      
    },
    handleCommand(command) {
      if (command === "modify") {
        // this.$router.push({
        //   path: "/user/changepassword"
        // });
        this.dialogVisible = true;
      } else if (command === "logout") {
        this.logout();
      }
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$store.commit("RESET_SIDEBAR");
        this.$store.commit("RESET_USER");
        this.$store.commit("RESET_PERMISSION");
        this.$store.commit("RESET_CURRENT_NAME");
        this.$router.push({
          path: "/login"
        });
        // location.reload() // 为了重新实例化vue-router对象 避免bug
      });
    }
  },
  created() {
    /* this.axios({
      method: "post",
      url: "/pangu-admin/user/login/getDetail"
    }).then(res => {
      this.user = res.data;
    }); */
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: fixed;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #20222A;
  border-bottom: 2px solid #041f40;
  border-radius: 0px !important;
  padding-right: 60px;
  z-index: 2000;
  .hamburger-container {
    fill: #fff;
    line-height: 68px;
    height: 60px;
    width: 60px;
    text-align: center;
    float: left;
    padding: 0 10px;
  }
  .title {
    color: #fff;
    font-size: 26px;
  }
  .current-user {
    position: absolute;
    right: 60px;
    top: 0;
    font-size: 0;
    .user-info {
      cursor: pointer;
      img {
        vertical-align: middle;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      span,
      i {
        margin-left: 10px;
        vertical-align: middle;
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
}
</style>

