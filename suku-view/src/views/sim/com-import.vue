<template>
  <div class="add-person">
    <el-form
      label-width="130px"
      :model="sim"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item
        label="选择激活套餐"
        prop="activeComboId"
      >
        <el-select
          v-model="sim.activeComboId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="activeMenu in activeComboList"
            :key="activeMenu.value"
            :label="activeMenu.label"
            :value="activeMenu.value"
          ></el-option>

        </el-select>
      </el-form-item>
      <el-form-item
        label="选择叠加套餐"
        prop="increaseComboIds"
      >
        <el-select
          v-model="increaseComboIds"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="increaseCombo in increaseComboList"
            :key="increaseCombo.value"
            :label="increaseCombo.label"
            :value="increaseCombo.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="type === 'B'"
        label="选择特惠套餐"
      >
        <el-select
          v-model="discountsComboIds"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="discountsCombo in discountsComboList"
            :key="discountsCombo.value"
            :label="discountsCombo.label"
            :value="discountsCombo.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="选择用户"
        prop="uid"
      >
        <el-select
          v-model="sim.uid"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="user in userList"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="选择onelink平台"
        prop="onelinkId"
      >
        <el-select
          v-model="sim.onelinkId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="onelink in onelinkList"
            :key="onelink.value"
            :label="onelink.label"
            :value="onelink.value"
          ></el-option>

        </el-select>
      </el-form-item>

      <el-form-item
        label="导入文件"
        prop="filepath"
      >
        <el-upload
          class="upload-demo"
          action="/sheet/upload"
          :headers="uploadHeaders"
          :on-success="handleSuccess"
        >
          <el-button
            size="small"
            type="primary"
          >点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >只能上传execl/cvs文件</div>
        </el-upload>
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
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      uploadHeaders: {
        "x-csrf-token": getToken()
      },
      sim: {
        uname: "",
        uid: "",
        activeComboId: "",
        activeComboName: "",
        otherComboIds: "",
        onelinkId: "",
        onelinkName: "",
        simType: "A",
        filepath: ""
      },
      increaseComboIds: [],
      discountsComboIds: [],
      activeComboList: [],
      increaseComboList: [],
      discountsComboList: [],
      userList: [],
      onelinkList: [],
      rules: {
        uid: [{ required: true, message: "请选择用户", trigger: "blur" }],
        activeComboId: [
          { required: true, message: "请选择激活套餐", trigger: "blur" }
        ],
        onelinkId: [
          { required: true, message: "请选择onelink", trigger: "blur" }
        ],
        filepath: [{ required: true, message: "请上传文件", trigger: "blur" }],
        increaseComboIds: [
          // { required: true, message: "请选择叠加套餐", trigger: "blur" }
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.increaseComboIds.length === 0) {
                callback('请选择叠加套餐');
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
    type: String
  },
  watch: {
    "sim.activeComboId"(val) {
      this.sim.activeComboName = this.getLabel(this.activeComboList, val);
    },
    "sim.uid"(val) {
      this.sim.uname = this.getLabel(this.userList, val);
    },
    "sim.onelinkId"(val) {
      this.sim.onelinkName = this.getLabel(this.onelinkList, val);
    }
  },
  methods: {
    getLabel(list, val) {
      return val ? list.filter(item => item.value === val)[0].label : "";
    },
    handleSuccess(response) {
      if (response.success) {
        this.sim.filepath = response.data.filepath;
      } else {
        this.$message.error(response.msg);
      }
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.sim.otherComboIds = this.increaseComboIds
            .concat(this.discountsComboIds)
            .join(",");
          this.sim.simType = this.type;
          let data = this.sim;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMLIST.SIM_IMPORT_SIMS
          }).then(r => {
            if (r.success) {
              this.$refs["ruleForm"].resetFields();
              this.$emit("close");
            } else {
              this.$message({
                type: "error",
                message: r.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    getSimComboByComboType(comboType) {
      return this.axios({
        method: "get",
        params: {
          pageNum: 1,
          pageSize: 9999,
          comboType,
          belongsToSimType: this.type
        },
        url: API.SIMCOMBO.SIM_COMBO_LIST
      });
    },
    getOnelink() {
      this.axios({
        method: "get",
        url: API.ONELINK.GET_ALL_ONELINK
      }).then(r => {
        this.onelinkList = (r.data || []).map(item => {
          return { label: item.name, value: item.id };
        });
      });
    },
    getChildUsers() {
      this.axios({
        method: "get",
        url: API.USERS.GET_CHILD_USERS
      }).then(r => {
        this.userList = (r.data || []).map(item => {
          return { label: item.name, value: item.id };
        });
      });
    }
  },
  mounted() {
    const promiseList = [1, 2, 3].map(comboType =>
      this.getSimComboByComboType(comboType)
    );
    Promise.all(promiseList).then(res => {
      const simComboList = res.map(simComboRes => {
        return simComboRes.data.list.map(simCombo => {
          return { value: simCombo.id, label: simCombo.name };
        });
      });
      this.activeComboList = simComboList[0];
      this.increaseComboList = simComboList[1];
      this.discountsComboList = simComboList[2];
    });
    this.getOnelink();
    this.getChildUsers();
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
