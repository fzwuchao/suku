<template>
  <div class="add-person">
    <el-form
      label-width="130px"
      :model="params"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="套餐"
        prop="comboIds"
      >
        <el-select
          v-model="params.comboIds"
          clearable
          placeholder="请选择"
          multiple
        >
          <el-option
            v-for="simCombo in simComboList"
            :label="simCombo.label"
            :value="simCombo.value"
            :key="simCombo.value"
          >
          </el-option>
        </el-select>
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
import API from "@/api";
export default {
  data() {
    return {
      params: {
        comboIds: []
      },
      simComboList: [],
      simType: "A",
      rules: {
        comboIds: [
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.params.comboIds.length === 0) {
                callback("请选择套餐");
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  props: {
    type: String,
    simIds: Array
  },
  watch: {
    type(val) {
      if (this.simType !== val) {
        this.simType = val;
        this.getSimComboList();
      }
    }
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const data = {
            simIds: this.simIds,
            otherComboIds: this.params.comboIds.join(",")
          };
          this.axios({
            method: "post",
            data,
            url: API.SIMLIST.SIM_BATCH_UPDATE
          }).then(r => {
            if (r.success) {
              this.$message({
                message: '更换套餐成功',
                type: 'success',
              })
              this.$emit('close');
              return;
            }
            this.$message({
              message: r.msg,
              type: 'error',
            })
          });
        }
      });
    },
    getSimComboList() {
      this.axios({
        method: "get",
        params: {
          simType: this.simType
        },
        url: API.SIMCOMBO.SIM_COMBO_COMBO_LIST
      }).then(r => {
        this.simComboList = (r.data || []).map(item => {
          return { label: item.name, value: item.id + "" };
        });
      });
    }
  },
  mounted() {
    this.simType = this.type;
    this.getSimComboList();
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
