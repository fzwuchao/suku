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
        user: null
      },
      userList: [],
      rules: {
        user: [
          { required: true, message: "请输选择用户", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) return;
        const [user] = this.userList
                      .filter(item => item.value === this.params.user)
                      .map(item => {
                        return { uid: item.value, uname: item.key}
                      })
        this.$emit("save", {...user});
      })
    },
    // 父组件调用
    reset() {
      this.$refs['ruleForm'].resetFields();
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
