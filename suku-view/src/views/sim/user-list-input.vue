<template>
  <div class="add-person">
    <el-form
      label-width="130px"
      :model="params"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="用户"
        prop="user"
      >
        <el-select
          v-model="params.user"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="user in userList"
            :label="user.key"
            :value="user.value"
            :key="user.value"
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
        user: null,
        inputValue: '',
      },
      userList: [],
      rules: {
        user: [
          { required: true, message: "请输选择用户", trigger: "change" }
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
          }
        ]
      }
    };
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
      this.params.inputValue = '';
      this.$refs["ruleForm"].clearValidate();
      this.radioType = val;
      this.inputPlaceHolder = radioTypeToPlaceholderMap[val];
    },
    reset() {
      this.radioType = 'simNum';
      this.$refs["ruleForm"].resetFields();
      this.params.inputValue2 = '';
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) return;
        const params = {};
        if (this.radioType === 'simNum') params.simNum = this.params.inputValue;
        if (this.radioType === 'simRange') params.simRange = [this.params.inputValue, this.params.inputValue2];
        const [user] = this.userList
                      .filter(item => item.value === this.params.user)
                      .map(item => {
                        return { uid: item.value, uname: item.key}
                      })
        this.$emit("save", {...user, ...params});
        this.reset();
      })
    },
    getUserList() {
      this.axios({
        method: "get",
        url: API.USERS.GET_SELECT_USERS
      }).then(r => {
        this.userList = r.data;
      });
    }
  },
  mounted() {
    this.getUserList();
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
