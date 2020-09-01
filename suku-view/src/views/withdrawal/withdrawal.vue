<template>
  <div class="add-person">
    <el-form label-width="130px" :model="selectedAccount" ref="ruleForm">
      <el-form-item label="可选常用账户">
        <el-select v-model="accId" clearable placeholder="请选择" @change="handleChange">
          <el-option
            v-for="account in accountList"
            :label="account.aliasName"
            :value="account.id"
            :key="account.id"
           />
        </el-select>
      </el-form-item>
      <el-form-item label="提现金额(元)">
        <span>{{money}}</span>
      </el-form-item>
      <el-form-item label="账户名">
        <span>{{selectedAccount.acName}}</span>
      </el-form-item>

      <el-form-item label="账户号">
        <span>{{selectedAccount.account}}</span>
      </el-form-item>
      <el-form-item label="开户行">
        <span>{{selectedAccount.acAddr}}</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">提现</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import API from "@/api";
export default {
  props: {
    money: Number,
    orderIds: String,
  },
  data() {
    return {
      accountList: [],
      accId: '',
      selectedAccount: {},
    };
  },
  methods: {
    handleChange(accId) {
      this.selectedAccount = this.accountList.filter(item => item.id === accId)[0];
    },
    getAllAccount() {
      this.axios({
        method: "get",
        url: API.WITHDRAWAL.GET_ALL_ACCOUNT
      }).then(r => {
        this.accountList = r.data || [];
      })
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.axios({
            method: "post",
            data: {
              amount: this.money,
              accId: this.selectedAccount.id,
              orderIds: this.orderIds,
            },
            url: API.WITHDRAWAL.WITHDRAWAL
          }).then(() => {
            // this.$router.push("/withdrawal/withdrawal-list");
            this.$emit("complate")
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getAllAccount();
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
