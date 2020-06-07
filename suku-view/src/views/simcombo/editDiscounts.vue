<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="simCombo" :rules="rules" ref="ruleForm">
      <el-form-item label="套餐名称" prop="name">
        <el-input v-model="simCombo.name"></el-input>
      </el-form-item>
      <el-form-item label="适用卡类型" prop="belongsToSimType">
        <el-checkbox-group v-model="belongsToSimType">
          <el-checkbox label="B">主叫卡</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
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
      simTypes: [],
      belongsToSimType: [],
      simCombo: {
        id: null,
        name: "",
        belongsToSimType: "",
        comboType: 3
      },
      rules: {
        name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
        belongsToSimType: [
          { required: true, message: "请勾选适用卡类型", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = this.simCombo;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMCOMBO.SIM_COMBO_SAVE
          }).then(res => {
            if (res.success) {
              this.$router.push("/simcombo/discountsList");
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
          id: this.$route.params.id
        },
        url: API.SIMCOMBO.SIM_COMBO_GET_BY_ID
      }).then(r => {
        this.simCombo = r.data;
        this.belongsToSimType = this.simCombo.belongsToSimType.split(",");
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
  mounted() {
    this.initBelongsToSimType();
    if (this.$route.params.id !== undefined) {
      this.getSimCombo();
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
