<template>
  <div class="add-person">
    <el-form label-width="130px" :model="account" :rules="rules" ref="ruleForm">
      <el-form-item label="别名" prop="aliasName">
        <el-input v-model="account.aliasName"></el-input>
      </el-form-item>
      <el-form-item  label="账户名" prop="acName">
        <el-input v-model="account.acName"></el-input>
      </el-form-item>
      <el-form-item  label="账户号" prop="account">
        <el-input v-model="account.account"></el-input>
      </el-form-item>
      <el-form-item  label="开户行" prop="acAddr">
        <el-input v-model="account.acAddr"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import API from "@/api";
// import { validateTel } from "../../utils/validate.js";
export default {
  data() {
    return {
      account: {
        id: null,
        aliasName: '',
        acName: '',
        account: '',
        acAddr: ''
      },
      rules: {
        acName: [
          { required: true, message: "请输入账户名", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账户号", trigger: "blur" }
        ],
        acAddr: [
          { required: true, message: "请输入开户行", trigger: "blur" }
        ]
      }
    };
  },
  props:['dataAccount'],
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = this.account;
          this.axios({
            method: "post",
            data: data,
            url: API.WITHDRAWAL.ACCOUNT_SAVE
          }).then(() => {
            this.$emit('complateAc')
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  },
  mounted() {},
  watch: {
    dataAccount(val) {
      this.account = val;
    }
  },
  created() {
    if(this.dataAccount) {
      this.account = this.dataAccount;
    }
    
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
