<template>
  <div class="add-person">
    <el-form
      label-width="130px"
      :model="sim"
      :rules="rules"
      ref="ruleForm"
    >
      
      <el-form-item
        label="虚拟倍数"
        prop="virtualMult"
      >
        <el-input-number
          v-model="sim.virtualMult"
          :controls="false"
        ></el-input-number>
        <span class="unit">倍</span>
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
          :action="url"
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
          >只能上传excel/csv文件</div>
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
import { urlPrefix } from "@/utils";
export default {
  data() {
    return {
      url: `${urlPrefix}/sheet/upload`,
      uploadHeaders: {
        "x-csrf-token": getToken()
      },
      sim: {
        onelinkId: "",
        onelinkName: "",
        simType: "A",
        virtualMult: 1,
        filepath: ""
      },
      onelinkList: [],
      rules: {
        onelinkId: [
          { required: true, message: "请选择onelink", trigger: "blur" }
        ],
        filepath: [{ required: true, message: "请上传文件", trigger: "blur" }],
      }
    };
  },
  props: {
    type: String
  },
  watch: {
    "sim.onelinkId"(val) {
      this.sim.onelinkName = this.getLabel(this.onelinkList, val);
    },
    "type"() {
      this.init()
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
          this.sim.simType = this.type;
          let data = this.sim;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMLIST.SIM_TRANSFOR
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
    init() {
      this.getOnelink();
    }
  },
  mounted() {
    this.init()
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
