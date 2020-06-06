<template>
  <div class="add-person">
    <edit-bar></edit-bar>
    <el-form label-width="130px" :model="simLogistics" :rules="rules" ref="ruleForm">
      <el-form-item label="流水号" prop="flowNo">
        <span>{{simLogistics.flowNo}}</span>
      </el-form-item>
      <el-form-item label="发卡用户" prop="sender">
        <span>{{simLogistics.sender}}</span>
      </el-form-item>
      <el-form-item label="收卡用户" prop="receiver">
        <span>{{simLogistics.receiver}}</span>
      </el-form-item>
      <el-form-item label="数量" prop="total">
        <span>{{simLogistics.total}}</span>
      </el-form-item>
      <el-form-item label="物流单号" prop="logisticsNo">
        <el-input v-model="simLogistics.logisticsNo"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="simLogistics.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="simLogistics.address"></el-input>
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
    return {
      simLogistics: {
        address: '',
        id: null,
        flowNo: '',
        logisticsNo: '',
        phone: '',
        receiver: "",
        sender: "",
        total: null,
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = this.simLogistics;
          this.axios({
            method: "post",
            data: data,
            url: API.SIMLOGISTICS.SAVE
          }).then(() => {
            this.$router.push("/warehouse/list");
          });
        } else {
          return false;
        }
      });
    },
    getInfo(id) {
      this.axios({
        method: "get",
        params: {
          id
        },
        url: API.SIMLOGISTICS.GET_SIMLOGISTICS_BY_ID
      }).then((r) => {
        this.simLogistics = r.data
      });
    }
  },
  mounted() {
    let { id } = this.$route.params;
    if(id) {
      this.simLogistics.id = id;
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
