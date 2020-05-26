<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="user" :rules="rules" ref="ruleForm">
      <el-form-item label="昵称" prop="name">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="分成率" prop="rate">
        <el-input v-model="user.rate"></el-input>
      </el-form-item>
      <el-form-item label="商户号" prop="mch_id">
        <el-input v-model="user.mch_id"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="user.role_id" clearable placeholder="请选择">
          <el-option label="运营商" :value="1">运营商</el-option>
          <el-option label="经销商" :value="2">经销商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="pws">
        <el-input v-model="user.pws"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="pws2">
        <el-input v-model="user.pws2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EditBar from "../../components/EditBar";
// import API from "@/api";
// import { validateTel } from "../../utils/validate.js";
export default {
  components: {
    EditBar
  },
  data() {
    /* let checkPhone = (rule, value, callback) => {
      if (!validateTel(value)) {
        callback("请输入正确的手机号");
      } else {
        callback();
      }
    }; */
    return {
      user: {
        id: 25,
        pid: 2,
        level: 2,
        username: "test",
        phone: "13707949965",
        name: "系统管理员",
        email: null,
        open_msg: 1,
        mch_id: "1230000109",
        rate: 0.5,
        float_price: "0.00",
        uuid: "deaff25c-335d-35e0-bad4-3d359461ac3c",
        created_at: "2019-08-22 15:08:13",
        updated_at: "2019-10-31 17:18:41",
        role_id: 1,
        parent_name: "系统管理员",
        open_msg_text: "<span style='color:green'>已开通</span>",
        role_name: "1"
      },
      rules: {
        username: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$router.push("/system/userList");
      /* this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = this.user;
          this.axios({
            method: "post",
            data: data,
            url: API.USERS.SHANYUAN.DEMAND_CREATE
          }).then(() => {
            this.$router.push("/demand/list");
          });
        } else {
          return false;
        }
      }); */
    }
  },
  mounted() {}
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
