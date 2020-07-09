<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form
      label-width="130px"
      :model="simCombo"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="套餐名称"
        prop="name"
      >
        <el-input v-model="simCombo.name" :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item
        label="适用卡类型"
        prop="belongsToSimType"
      >
        <el-checkbox-group v-model="belongsToSimType" :disabled="isDisabled">
          <el-checkbox label="A">被叫卡</el-checkbox>
          <el-checkbox label="B">主叫卡</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="套餐月流量"
        prop="monthFlow"
      >
        <el-input-number
          :precision="2"
          :controls="false"
          :disabled="isDisabled"
          v-model="simCombo.monthFlow"
        ></el-input-number>
        <span class="unit">M</span>
      </el-form-item>
      <el-form-item
        label="月通话时长"
        prop="monthVoice"
        v-if="isShow"
      >
        <el-input-number
          v-model="simCombo.monthVoice"
          :controls="false"
          :disabled="isDisabled"
        ></el-input-number>
        <span class="unit">分</span>
      </el-form-item>
      <el-form-item
        label="月租"
        prop="monthRent"
      >
        <el-input-number
          v-model="simCombo.monthRent"
          :controls="false"
          :disabled="isDisabled"
        ></el-input-number>
        <span class="unit">元</span>
      </el-form-item>
      <el-form-item
        label="月份长度"
        prop="month"
      >
        <el-input-number
          v-model="simCombo.months"
          :controls="false"
          :precision="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="续费价格"
        prop="renewPrice"
      >
        <el-input-number
          :controls="false"
          :precision="2"
          v-model="renewPrice"
          :disabled="true"
        ></el-input-number>
        <span class="unit">元</span>
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
// import { validateTel } from "../../utils/validate.js";
export default {
  components: {
    EditBar
  },
  data() {
    return {
      isShow: true,
      isDisabled: true,
      simTypes: [],
      belongsToSimType: [],
      simCombo: {
        id: '',
        name: "",
        belongsToSimType: "",
        monthFlow: 0,
        monthVoice: 0,
        monthRent: 0,
        months: 1,
        renewPrice: 0,
        comboType: 1
      },
      rules: {
        name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
        belongsToSimType: [
          { required: true, message: "请勾选适用卡类型", trigger: "blur" }
        ],
        monthFlow: [
          { required: true, message: "请输入套餐月流量", trigger: "blur" }
        ],
        monthVoice: [
          { required: true, message: "请输入月通话时长", trigger: "blur" }
        ],
        monthRent: [{ required: true, message: "请输入月租", trigger: "blur" }],
        months: [{ required: true, message: "请输入月份长度", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.simCombo.renewPrice = this.renewPrice;
          let data = this.simCombo;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMCOMBO.SIM_COMBO_SAVE
          }).then(res => {
            if (res.success) {
              this.$router.push("/simcombo/list");
            } else {
              !res.success &&
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
            }
          });
        } else {
          return false;
        }
      });
    },
    getSimCombo() {
      this.axios({
        method: "get",
        params: {
          id: this.$route.params.id,
        },
        url: API.SIMCOMBO.SIM_COMBO_GET_BY_ID
      }).then(r => {
        this.simCombo = r.data;
        this.renewPrice = this.simCombo.renewPrice;
        this.belongsToSimType = this.simCombo.belongsToSimType.split(',');
        this.isShow = !this.belongsToSimType.includes('A');
      });
    },
    initBelongsToSimType(val) {
      if (val !== undefined) {
        this.simCombo.belongsToSimType = val;
      } else {
        this.simCombo.belongsToSimType = this.belongsToSimType.join(",");
      }
    }
  },
  watch: {
    belongsToSimType(newVal) {
      this.initBelongsToSimType(newVal.join(","));
    }
  },
  computed: {
    renewPrice() {
      const { monthRent, months } = this.simCombo;
      return monthRent * months;
    }
  },
  mounted() {
    this.initBelongsToSimType();
    this.getSimCombo();
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
  .unit {
    color: #f56c6c;
  }
}
</style>
