<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="sim" :rules="rules" ref="ruleForm">
      <el-form-item label="Sim卡号">
        <span>{{ sim.simId }}</span>
      </el-form-item>
      <el-form-item label="ICCID">
        <span>{{ sim.iccid }}</span>
      </el-form-item>
      <el-form-item label="IMEI">
        <span>{{ sim.imei }}</span>
      </el-form-item>
      <el-form-item label="平台状态">
        <span>{{ sim.cardStatus | cardStatus}}</span>
      </el-form-item>
       <el-form-item label="激活套餐名">
        <span>{{ sim.activeComboName }}</span>
      </el-form-item>
      <el-form-item label="激活时间">
        <span>{{ sim.activeTime }}</span>
      </el-form-item>
      <el-form-item label="过期时间">
        <span>{{ sim.overdueTime }}</span>
      </el-form-item>
      <el-form-item label="过期时间">
        <span>{{ sim.overdueTime }}</span>
      </el-form-item>
      <el-form-item label="续费价格">
        <span>{{ sim.renewPrice }}</span>
      </el-form-item>
      <el-form-item label="用户">
        <span>{{ sim.uname }}</span>
      </el-form-item>
      <el-form-item label="当月流量阈(M)">
        <span>{{ `${sim.monthFlow ? sim.monthFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item label="叠加流量(M)">
        <span>{{ `${sim.monthOverlapFlow ? sim.monthOverlapFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item label="已用流量(M)">
        <span>{{ `${sim.monthUsedFlow ? sim.monthUsedFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item label="剩余流量(M)">
        <span>{{ `${sim.monthShengyuFlow ? sim.monthShengyuFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item label="余额(元)" v-if="sim.simType === 'B'">
        <span>{{ `${sim.monthShengyuFlow ? sim.monthShengyuFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item label="当月语音阈(分)" v-if="sim.simType === 'B'">
        <span>{{ `${sim.monthVoice ? sim.monthVoice : 0}` }}</span>
      </el-form-item>
      <el-form-item label="已用语音(分)" v-if="sim.simType === 'B'">
        <span>{{ `${sim.monthUsedVoiceDuration ? sim.monthUsedVoiceDuration : 0}` }}</span>
      </el-form-item>
      <el-form-item label="当月剩余语音(分)" v-if="sim.simType === 'B'">
        <span>{{ `${sim.monthShengyuVoiceDuration ? sim.monthShengyuVoiceDuration : 0}` }}</span>
      </el-form-item>
      <el-form-item label="流量服务状态">
        <span>{{ sim.flowServStatus | serveStatus}}</span>
      </el-form-item>
      <el-form-item label="语音服务状态" v-if="sim.simType === 'B'">
        <span>{{ sim.voiceServStatus | serveStatus }}</span>
      </el-form-item>
      <el-form-item label="开关机状态">
        <span>{{ sim.openStatus === 0 ? '关机' : '开机' }}</span>
      </el-form-item>
      <el-form-item label="添加时间">
        <span>{{ sim.createdAt }}</span>
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
import API from "@/api";
// import { validateTel } from "../../utils/validate.js";
export default {
  components: {
    EditBar
  },
  data() {
    return {
      sim: {
        
      },
      simId: null,
      rules: {
        username: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ]
      }
    };
  },
  filters:{
    cardStatus(val){
      const status= {
        '1' : "待激活",
        '2' : "已激活",
        '4' : "停机",
        '6' : "可测试",
        '21': "注销",
        '22': "欠费"
      }
      return status[val];
    },
    serveStatus(val) {
      const serveStatus = {
        1: '开',
        2: '关',
      }
      return serveStatus[val];
    }
  },
  methods: {
    submit() {
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
    },
    getSimBySimId() {
      this.axios({
        method: "get",
        params: {
          simId: this.simId,
        },
        url: API.SIMLIST.SIM_GET_SIM
      }).then((r) => {
        this.sim = r.data;
      });
    },

  },
  mounted() {
   const { id } = this.$route.params;
   this.simId = id;
   this.getSimBySimId();
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
