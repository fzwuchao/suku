<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="onelink" :rules="rules" ref="ruleForm">
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="onelink.name" placeholder="请输入平台名称"></el-input>
      </el-form-item>
      <el-form-item label="appId" prop="appId">
        <el-input v-model="onelink.appId" placeholder="请输入appId"></el-input>
      </el-form-item>
      <el-form-item label="密钥" prop="secretKey">
        <el-input v-model="onelink.secretKey" placeholder="请输入接口密钥"></el-input>
      </el-form-item>
      <el-form-item label="apiHost" prop="apiHost">
        <el-input v-model="onelink.apiHost" placeholder="请输入接口地址"></el-input>
      </el-form-item>
      <el-form-item label="接口版本号" prop="apiVersion">
        <el-input v-model="onelink.apiVersion" placeholder="请输入接口版本号"></el-input>
      </el-form-item>
      <el-form-item label="平台账号" prop="loginName">
        <el-input v-model="onelink.loginName" placeholder="请输入平台账号"></el-input>
      </el-form-item>
      <el-form-item label="平台密码" prop="loginPws">
        <el-input v-model="onelink.loginPws" placeholder="请输入平台密码"></el-input>
      </el-form-item>
      <el-form-item v-if="!onelink.id" label="nameKey" prop="nameKey">
        <el-input v-model="onelink.nameKey" placeholder="请输入redis关键字"></el-input>
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
export default {
  components: {
    EditBar
  },
  data() {
    let checkNamekey = (rule, value, callback) => {
        this.axios({
          method: "get",
          params: {nameKey:value},
          url: API.ONELINK.GET_ONELINK_BY_NAMEKEY
        }).then((r) => {
          if(r.data.exit) {
            callback(r.msg);
          } else {
            callback();
          }
        });
    };
    return {
      onelink: {
        id: null,
        apiHost: "",
        apiVersion: "",
        appId: "",
        name: "",
        secretKey: "",
        loginName: "",
        loginPws: "",
        nameKey: "",
      },
      rules: {
        apiHost: [
          { required: true, message: "请输入接口地址", trigger: "blur" },
          {  max: 100, message: '长度不能大于100个字符', trigger: 'blur' }
        ],
        apiVersion: [
          { required: true, message: "请输入接口版本号", trigger: "blur" },
          {  max: 30, message: '长度不能大于30个字符', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: "请输入接口版本号", trigger: "blur" },
          {  max: 100, message: '长度不能大于100个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
          {  max: 30, message: '长度不能大于30个字符', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: "请输入接口密钥", trigger: "blur" },
          {  max: 100, message: '长度不能大于100个字符', trigger: 'blur' }
        ],
        loginName: [
          {  max: 50, message: '长度不能大于100个字符', trigger: 'blur' }
        ],
        loginPws: [
          {  max: 50, message: '长度不能大于100个字符', trigger: 'blur' }
        ],
        nameKey: [
          { required: true, message: "请输入redis关键字", trigger: "blur" },
          {  max: 50, message: '长度不能大于50个字符', trigger: 'blur' },
          { required: true, validator: checkNamekey,  trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    getInfo(id) {
      this.axios({
        method: "get",
        params: {
          id
        },
        url: API.ONELINK.GET_ONELINK_BY_ID
      }).then((r) => {
        this.onelink = r.data
      });
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = this.onelink;
          this.axios({
            method: "post",
            data: data,
            url: API.ONELINK.SAVE
          }).then(() => {
            this.$router.push("/system/onelinklist");
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {},
  created() {
    let { id } = this.$route.params;
    if(id) {
      this.onelink.id = id;
      this.getInfo(id)
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
