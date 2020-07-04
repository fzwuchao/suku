<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width="40%"
    :show-close="false"
  >
    <div class="formWrap">
      <el-form
        label-width="130px"
        :model="user"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="新密码"
          prop="password"
        >
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password2"
        >
          <el-input type="password" v-model="user.password2"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancel">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import API from "@/api";
export default {
  props: {
    dialogVisible: Boolean,
    userId: Number,
    username: String,
  },
  data() {
    return {
      user: {
        password: '',
        password2: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码',  trigger: "blur" }
        ],
        password2: [
          { required: true, message: '请输入确认密码',  trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid && this.checkPassword()) {
          let data = this.user;
          data.id = this.userId;
          data.username = this.username;
          delete this.user.password2;
          this.axios({
            method: "post",
            data: data,
            url: API.USERS.UPDATE_PWD
          }).then(() => {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.$emit('close', 'submit');
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit('close', 'cancel');
    },
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
  }
};
</script>
<style lang="scss">

</style>
