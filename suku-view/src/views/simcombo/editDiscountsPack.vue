<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="simCombo" :rules="rules" ref="ruleForm">
      <el-form-item label="套餐包名" prop="comboName">
        <el-input v-model="simCombo.comboName"></el-input>
      </el-form-item>
      <el-form-item label="所属套餐" prop="type">
        <el-select v-model="simCombo.type" clearable placeholder="请选择">
          <el-option label="运营商" :value="1">运营商</el-option>
          <el-option label="经销商" :value="2">经销商</el-option>
        </el-select><span>被叫卡是否一定不能有惠套餐包，如果是，则选中了适用被叫卡的套餐，这添加提示报错</span>
      </el-form-item>
      <el-form-item label="金额" prop="monthFlow">
        <el-input v-model="simCombo.monthFlow"></el-input>
      </el-form-item>
      <el-form-item label="赠送金额" prop="monthMin">
        <el-input v-model="simCombo.monthMin"></el-input>
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
      simTypes: [],
      simCombo: {
        id: 16,
        type: 1, // 1:激活套餐，2: 叠加套餐，3:充送套餐
        delStatus: 0, // 1:已删除；0:未删除
        comboName: "被叫卡激活套餐",
        monthFlow: "60.00",
        monthMin: "0.00",
        month: 6,
        simType: "A",
        monthPrice: "20.00",
        renewPrice: "120.00",
        created_at: "2019-08-15 21:01:56",
        updated_at: "2019-08-15 21:01:56"
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
  mounted() {
    this.simTypes = this.simCombo.simType.split(",");
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
