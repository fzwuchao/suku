<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form
      label-width="130px"
      :model="sim"
      :rules="rules"
      ref="ruleForm"
    >
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
      <el-form-item
        label="余额(元)"
        v-if="sim.simType === 'B'"
      >
        <span>{{ `${sim.monthShengyuFlow ? sim.monthShengyuFlow : 0}` }}</span>
      </el-form-item>
      <el-form-item
        label="当月语音阈(分)"
        v-if="sim.simType === 'B'"
      >
        <span>{{ `${sim.monthVoice ? sim.monthVoice : 0}` }}</span>
      </el-form-item>
      <el-form-item
        label="已用语音(分)"
        v-if="sim.simType === 'B'"
      >
        <span>{{ `${sim.monthUsedVoiceDuration ? sim.monthUsedVoiceDuration : 0}` }}</span>
      </el-form-item>
      <el-form-item
        label="当月剩余语音(分)"
        v-if="sim.simType === 'B'"
      >
        <span>{{ `${sim.monthShengyuVoiceDuration ? sim.monthShengyuVoiceDuration : 0}` }}</span>
      </el-form-item>
      <el-form-item label="流量服务状态">
        <span>{{ sim.flowServStatus | serveStatus}}</span>
      </el-form-item>
      <el-form-item
        label="语音服务状态"
        v-if="sim.simType === 'B'"
      >
        <span>{{ sim.voiceServStatus | serveStatus }}</span>
      </el-form-item>
      <el-form-item label="开关机状态">
        <span>{{ sim.openStatus === 0 ? '关机' : '开机' }}</span>
      </el-form-item>
      <el-form-item label="添加时间">
        <span>{{ sim.createdAt }}</span>
      </el-form-item>
      <el-form-item
        label="套餐"
        prop="comboIds"
      >
        <el-select
          v-model="comboIds"
          clearable
          :disabled="true"
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
      <el-form-item
        label="用户月增价"
        prop="privateMoney"
      >
        <el-input-number
          v-model="sim.privateMoney"
          :controls="false"
        ></el-input-number>
        <span class="unit">元</span>
      </el-form-item>
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
      
      <el-form-item label="过期时间">
        <el-date-picker
          v-model="sim.overdueTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
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
        otherComboIds: "",
        simType: "A"
      },
      simComboList: [],
      comboIds: [],
      simId: null,
      rules: {
        comboIds: [
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.comboIds.length === 0) {
                callback("请选择套餐");
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  filters: {
    cardStatus(val) {
      const status = {
        "1": "待激活",
        "2": "已激活",
        "4": "停机",
        "6": "可测试",
        "21": "注销",
        "22": "欠费"
      };
      return status[val];
    },
    serveStatus(val) {
      const serveStatus = {
        1: "开",
        0: "关"
      };
      return serveStatus[val];
    }
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const data = {
            otherComboIds: this.comboIds.join(","),
            overdueTime: this.sim.overdueTime,
            privateMoney: this.sim.privateMoney,
            virtualMult: this.sim.virtualMult,
            simId: this.simId
          };
          this.axios({
            method: "post",
            data,
            url: API.SIMLIST.SIM_UPDATE
          }).then(() => {
            this.$router.push(`/sim/list/${this.sim.simType}`);
          });
        } else {
          return false;
        }
      });
    },
    async getSimBySimId() {
      await this.axios({
        method: "get",
        params: {
          simId: this.simId
        },
        url: API.SIMLIST.SIM_GET_SIM
      }).then(r => {
        this.sim = r.data;
      });
    },
    async getSimComboList() {
      await this.axios({
        method: "get",
        params: {
          simType: this.sim.simType
        },
        url: API.SIMCOMBO.SIM_COMBO_COMBO_LIST
      }).then(r => {
        this.simComboList = (r.data || []).map(item => {
          return { label: item.name, value: item.id + "" };
        });
        this.comboIds = (this.sim.otherComboIds || "").split(",");
      });
    }
  },
  async mounted() {
    const { id } = this.$route.params;
    this.simId = id;
    await this.getSimBySimId();
    await this.getSimComboList();
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
