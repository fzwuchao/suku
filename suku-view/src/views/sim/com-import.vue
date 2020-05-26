<template>
  <div class="add-person">
    <el-form label-width="130px" :model="sim" :rules="rules" ref="ruleForm">
      <el-form-item label="选择激活套餐">
        <el-select v-model="sim.menu_id" clearable placeholder="请选择">
          <el-option label="半年卡50m" :value="1">半年卡50m</el-option>
          <el-option label="3G年卡" :value="2">3G年卡</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择叠加套餐">
        <el-select v-model="value2" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type=='B'" label="选择特惠套餐">
        <el-select v-model="value" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择用户">
        <el-select v-model="sim.uuid" clearable placeholder="请选择">
          <el-option label="运营商" :value="1">运营商</el-option>
          <el-option label="经销商" :value="2">经销商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择onelink平台">
        <el-select v-model="sim.uuid" clearable placeholder="请选择">
          <el-option label="运营商" :value="1">运营商</el-option>
          <el-option label="经销商" :value="2">经销商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号">
        <el-inpit v-model="sim.uuid" placeholder="请输入物流单号"></el-inpit>
      </el-form-item>
      <el-form-item label="导入文件">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传execl/cvs文件</div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import API from "@/api";
export default {
  data() {
    return {
      sim: {
        username: "\u963f\u6e29",
        sim_type: "A",
        menu_name: "30M\u5e74\u5361",
        menu_id: 17,
        uuid: "1"
      },
      value2: [],
      value: [],
      options: [
        {
          value: "选项1",
          label: "流量叠加1"
        },
        {
          value: "选项2",
          label: "流量叠加2"
        }
      ],
      rules: {
        username: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    type: String
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
  mounted() {}
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
