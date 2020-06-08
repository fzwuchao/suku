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
        label="套餐包名"
        prop="name"
      >
        <el-input v-model="simCombo.name"></el-input>
      </el-form-item>
      <el-form-item
        label="所属套餐"
        prop="comboId"
      >
        <el-select
          v-model="simCombo.comboId"
          clearable
          placeholder="请选择"
        >

          <el-option
            v-for="item in simComboList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>

        </el-select>
      </el-form-item>
      <el-form-item
        label="金额"
        prop="money"
      >
        <el-input-number
          v-model="simCombo.money"
          :controls="false"
        ></el-input-number>
        <span class="unit">元</span>
      </el-form-item>
      <el-form-item
        label="赠送金额"
        prop="awardMoney"
      >
        <el-input-number
          v-model="simCombo.awardMoney"
          :controls="false"
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
      simComboList: [],
      simCombo: {
        id: null,
        money: 0,
        awardMoney: 0,
        comboId: "",
        comboType: 3
      },
      rules: {
        name: [{ required: true, message: "请输入套餐包名", trigger: "blur" }],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
        awardMoney: [
          { required: true, message: "请输入赠送金额", trigger: "blur" }
        ],
        comboId: [
          { required: true, message: "请选择所属套餐", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const data = this.simCombo;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMCOMBO.COMBO_PACK_SAVE
          }).then(res => {
            if (res.success) {
              this.$router.push("/simcombo/discountsPackList");
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
          comboType: this.simCombo.comboType
        },
        url: API.SIMCOMBO.SIM_COMBO_GET_BY_COMBO_TYPE
      }).then(res => {
        this.simComboList = res.data.map(item => {
          return { value: item.id, label: item.name };
        });
      });
    },
    getComboPack() {
      this.axios({
        method: "get",
        params: {
          id: this.$route.params.id
        },
        url: API.SIMCOMBO.COMBO_PACK_GET_BY_ID
      }).then(res => {
        this.simCombo = res.data;
      });
    }
  },
  mounted() {
    this.getSimCombo();
    if (this.$route.params.id !== undefined) {
      this.getComboPack();
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
