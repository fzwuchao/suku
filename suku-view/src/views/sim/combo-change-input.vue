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
      <el-form-item label="类型">
        <el-radio-group v-model="radioType" @change="changeType">
          <el-radio label="simNum">卡号</el-radio>
          <el-radio label="simRange">卡段</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡号" prop="inputValue" v-if="radioType === 'simNum'">
        <el-input  v-model="params.inputValue" :placeholder="inputPlaceHolder"></el-input>
      </el-form-item>
      <el-form-item label="卡段" prop="inputValue" v-if="radioType !== 'simNum'">
        <el-input style="width: 150px" v-model="params.inputValue" :placeholder="inputPlaceHolder"></el-input>-
        <el-input style="width: 150px" v-model="params.inputValue2" :placeholder="inputPlaceHolder"></el-input>
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
const radioTypeToPlaceholderMap = {
  simNum: '多个卡号用英文的逗号隔开, 如: 卡号1,卡号2',
  simRange: '请输入卡号',
}
export default {
  data() {
    return {
      inputPlaceHolder: radioTypeToPlaceholderMap.simNum,
      radioType: 'simNum',
      params: {
        comboIds: [],
        inputValue: '',
        inputValue2: '',
      },
      simComboList: [],
      simType: "A",
      rules: {
        comboIds: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.params.comboIds.length === 0) {
                callback("请选择套餐");
              } else {
                callback();
              }
            }
          }
        ],
        inputValue: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.radioType === 'simNum') {
                if (!value || value.trim() === '') {
                  callback("不能为空");
                } else {
                  const error = this.checkSimNum(value);
                  callback(error);
                }
              } else {
                if (!this.params.inputValue || !this.params.inputValue.trim() === '' || !this.params.inputValue2 || !this.params.inputValue2.trim() === '') {
                  callback('卡段不能为空')
                } else {
                  const error1 = this.checkSimRange(this.params.inputValue);
                  const error2 = this.checkSimRange(this.params.inputValue2);
                  if (error1 || error2) {
                    callback(error1 || error2)
                  } else {
                    callback();
                  }
                }
              }
              
            }
          },
        ],
      }
    };
  },
  props: {
    type: String,
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
    checkSimNum(val) {
      const reg = /^(\d+,?)+$/;
      if (!reg.test(val) || val.endsWith(',')) {
        return '只能包含数字和英文的逗号, 如卡号1,卡号2';
      }
      return undefined;
    },
    checkSimRange(val) {
      const reg = /^\d+$/;
      if (!reg.test(val)) {
        return '只能包含数字';
      }
      return undefined;
    },
    changeType(val) {
      this.radioType = val;
      this.params.inputValue = '';
      this.$refs["ruleForm"].clearValidate();
      this.inputPlaceHolder = radioTypeToPlaceholderMap[val];
    },
    reset() {
      this.radioType = 'simNum';
      this.$refs["ruleForm"].resetFields();
      this.params.inputValue2 = '';
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const data = {
            otherComboIds: this.params.comboIds.join(",")
          };
          const params = {};
          if (this.radioType === 'simNum') {
            params.simNum = this.params.inputValue;
          } else {
            params.simRange = [this.params.inputValue, this.params.inputValue2];
          }
          this.axios({
            method: "post",
            data: {
              ...data,
              ...params,
              simType: this.simType,
            },
            url: API.SIMLIST.SIM_BATCH_UPDATE_SIM_COMBO
          }).then(r => {
            if (r.success) {
              this.$message({
                message: '更换套餐成功',
                type: 'success',
              })
              this.reset();
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
