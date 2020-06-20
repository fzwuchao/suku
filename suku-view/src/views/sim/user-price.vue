<template>
  <div class="add-person">
    <el-form
      label-width="130px"
      :model="params"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="用户增价"
        prop="privateMoney"
      >
        <el-input-number
          v-model="params.privateMoney"
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
export default {
  data() {
    return {
      params: {
        privateMoney: 0
      },
      rules: {
        privateMoney: [
          { required: true, message: "请输入赠价", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) return;
        this.$emit('save', this.params.privateMoney);
      })
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
