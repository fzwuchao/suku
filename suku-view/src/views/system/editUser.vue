<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form
      label-width="130px"
      :model="user"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="昵称"
        prop="name"
      >
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item
        v-if="isSysManager"
        label="分成率"
        prop="rate"
      >
        <el-input v-model="user.rate"></el-input>
      </el-form-item>
      <el-form-item
        label="商户号"
        prop="mchId"
      >
        <el-input v-model="user.mchId"></el-input>
      </el-form-item>
      <el-form-item v-if="user.id != curUser.id" label="权限">
        <el-select
          v-model="user.roleId"
          clearable
          placeholder="请选择"
        >
          <el-option
            :label="item.displayName"
            v-for="(item,index) in roleList"
            :key="index"
            :value="item.id"
          >{{item.displayName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        v-if="!user.id"
      >
        <el-input type="password" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="password2"
        v-if="!user.id"
      >
        <el-input type="password" v-model="user.password2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EditBar from "../../components/EditBar";
import API from "@/api";
import { validateTel ,validateEmail} from "../../utils/validate.js";
export default {
  components: {
    EditBar
  },
  data() {
    let checkPhone = (rule, value, callback) => {
      if (value && value.trim() && !validateTel(value)) {
        callback("请输入正确的手机号");
      } else {
        callback();
      }
    };
    let checkEmail = (rule, value, callback) => {
      if (value && value.trim() && !validateEmail(value)) {
        callback("请输入正确的邮箱");
      } else {
        callback();
      }
    };
    let checkUsername = (rule, value, callback) => {
      if((value && value.trim() == '') || !value) {
        callback("请输入用户名");
        return;
      }
      if(!this.initUsername || this.initUsername != this.user.username){
        this.axios({
          method: "get",
          params: {username:value},
          url: API.USERS.GET_USER_BY_USERNAME
        }).then((r) => {
          if(r.data.exit) {
            callback(r.msg);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    let checkName = (rule, value, callback) => {
      if((value && value.trim() == '') || !value) {
        callback("请输入昵称");
        return;
      }
      if(!this.initName || this.initName != this.user.name){
        this.axios({
          method: "get",
          params: {name:value},
          url: API.USERS.GET_USER_BY_NAME
        }).then((r) => {
          if(r.data.exit) {
            callback(r.msg);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    return {
      isSysManager: false,
      curUser: {},
      user: {
        "id": null,
        "name": "",
        "username": "",
        "email": "",
        "mchId": "",
        "rate": "",
        "password": '',
        "password2": '',
        "roleId": null      
      },
      initUsername: '',
      initName: '',
      rules: {
        username: [
          { required: true, validator: checkUsername,  trigger: "blur" }
        ],
        name: [
          { required: true, validator: checkName, trigger: "blur" }
        ],
        phone:[
          {validator: checkPhone, trigger: 'blur'}
        ],
        email:[
          {validator: checkEmail, trigger: 'blur'}
        ]
      },
      roleList:[]
    };
  },
  methods: {
    checkPassword() {
      if( this.user.password !== this.user.password2) {
        this.$message({
          showClose: true,
          message: '两次密码输入的值不一致，请重新输入',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    getUserInfo(id) {
      this.axios({
        method: "get",
        params: {
          id
        },
        url: API.USERS.GET_USER_BY_ID
      }).then((r) => {
        this.user = r.data
        this.initUsername = this.user.username;
        this.initName = this.user.name;
      });
    },
    getRoles() {
      this.axios({
        method: "get",
        url: API.USERS.GET_ROLES
      }).then((r) => {
        this.roleList = r.data
        if(r.data && !this.user.roleId) {
          this.user.roleId = this.roleList[0].id
        }
      });
    },
    submit() {
      // this.$router.push("/system/userList");
      this.$refs["ruleForm"].validate(valid => {
       
        if (valid && this.checkPassword()) {
          let data = this.user;
          delete this.user.password2;
          if(this.user.id) {
            delete this.user.password
          }
          this.axios({
            method: "post",
            data: data,
            url: API.USERS.USER_SAVE
          }).then(() => {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            this.$router.push("/system/userList");
          });
        } else {
          return false;
        }
      });
    },
    getRoleType() {
      this.curUser = JSON.parse(localStorage.getItem('userInfo'));
      this.isSysManager =this.curUser.roleType === 1;
    },
  },
  mounted() {
    this.getRoleType();
  },
  created() {
    let { id } = this.$route.params;
    if(id) {
      this.user.id = id;
      this.getUserInfo(id)
    }
    this.getRoles()
  }
};
</script>

<style lang="scss" scoped>
.add-person {
  padding: 20px;

  .btn-wrapper {
    text-align: right;
  }
  .title {
    font-size: 18px;
    color: #333;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
  }
  .small {
    font-size: 14px;
  }
  .multiple {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .note {
    margin: 0 5px;
  }
  .image-wrapper {
    display: inline-block;
    width: 200px;
    height: 200px;
    a {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      img {
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 200px;
      }
    }
  }
}
</style>
