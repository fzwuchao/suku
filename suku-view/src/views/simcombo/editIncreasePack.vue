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
          @change="comboChange"
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
        label="流量"
        prop="monthFlow"
      >
        <el-input-number
          :precision="2"
          :controls="false"
          v-model="simCombo.monthFlow"
        ></el-input-number>
        <span class="unit">M</span>
      </el-form-item>
      <el-form-item
        label="语音时长"
        prop="monthVoice"
        v-if="isShow"
      >
        <el-input-number
          v-model="simCombo.monthVoice"
          :controls="false"
        ></el-input-number>
        <span class="unit">分</span>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number
          v-model="simCombo.money"
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
      isShow: true,
      simCombo: {
        id: null,
        name: "",
        monthFlow: 0,
        monthVoice: 0,
        comboId: "",
        comboType: 2,
        money: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入套餐包名", trigger: "blur" }],
        comboId: [
          { required: true, message: "请选择所属套餐", trigger: "blur" }
        ],
        monthFlow: [
          { required: true, message: "请输入流量", trigger: "blur" }
        ],
        monthVoice: [
          { required: true, message: "请输入语音时长", trigger: "blur" }
        ]
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
            url: API.SIMCOMBO.COMBO_PACK_SAVE
          }).then(res => {
            if (res.success) {
              this.$router.push("/simcombo/increasePackList");
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
    comboChange(val) {
      // const belongsToSimType = this.simComboList.filter(combo => combo.value === val)[0].belongsToSimType;
      // if (belongsToSimType.includes('A')) {
      //   this.isShow = false;
      // } else {
      //   this.isShow = true;
      // }
      this.setVoiceIsShow(val);
    },
    setVoiceIsShow(val) {
      const belongsToSimType = this.simComboList.filter(
        combo => combo.value === val
      )[0].belongsToSimType;
      if (belongsToSimType.includes("A")) {
        this.isShow = false;
        this.simCombo.monthVoice = 0;
      } else {
        this.isShow = true;
      }
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
          return {
            value: item.id,
            label: item.name,
            belongsToSimType: item.belongsToSimType
          };
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
        this.setVoiceIsShow(this.simCombo.comboId);
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
