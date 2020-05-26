<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="sim" :rules="rules" ref="ruleForm">
      <el-form-item label="卡号">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="ICCID">
        <span>{{ sim.iccid }}</span>
      </el-form-item>
      <el-form-item label="IMEI">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="平台状态">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="激活时间">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="已使用流量">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="总流量">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="套餐流量">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="已使用语音">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="语音状态">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="平台语音状态">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="开关机">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="通信状态">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>
      <el-form-item label="添加时间">
        <span>{{ sim.sim_id }}</span>
      </el-form-item>

      <el-form-item label="续费价格" prop="sim_id">
        <el-input v-model="sim.sim_id"></el-input>
      </el-form-item>
      <el-form-item label="月租增价" prop="sim_id">
        <el-input v-model="sim.sim_id"></el-input>
      </el-form-item>
      <el-form-item label="套餐增价" prop="sim_id">
        <el-input v-model="sim.sim_id" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="套餐" prop="is_active">
        <el-select v-model="sim.is_active" clearable placeholder="请选择">
          <el-option label="运营商" :value="0">运营商</el-option>
          <el-option label="经销商" :value="2">经销商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="过期时间" prop="sim_id">
        <el-input v-model="sim.sim_id"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EditBar from "../../components/EditBar";
// import API from "@/api";
// import { validateTel } from "../../utils/validate.js";
export default {
  components: {
    EditBar
  },
  data() {
    /* let checkPhone = (rule, value, callback) => {
      if (!validateTel(value)) {
        callback("请输入正确的手机号");
      } else {
        callback();
      }
    }; */
    return {
      sim: {
        sim_id: 17290033433,
        iccid: "0",
        active_time: null,
        overdue_time: null,
        username: "\u963f\u6e29",
        sim_type: "A",
        net_status: "<span style='color:green'>\u6b63\u5e38</span>",
        month_sum_flow: "30 M",
        overlap_flow: "0.00 M",
        renew_price: 60,
        office_renew_price: "60.00",
        renew_add_price: "0.00",
        menu_flow: "30.00 M",
        menu_name: "30M\u5e74\u5361",
        menu_id: 17,
        month_used_flow: 0,
        shengyu_flow: "30 M",
        voice_flow: "",
        voice_status: "\u5f00\u542f",
        voice_time: "0.00",
        shengyu_voice: 0,
        cardStatus: "",
        openStatus: "",
        networkStatus: "\u65e0",
        apiVoiceStatus: "\u65e0",
        imei: "0",
        created_at: "2020-05-13 10:20:30",
        is_active: 0,
        money: null
      },
      rules: {
        username: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ]
      }
    };
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
