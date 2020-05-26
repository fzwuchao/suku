<template>
  <div class="add-person">
    <edit-bar ></edit-bar>
    <el-form label-width="130px">
      <el-form-item label="机构名称">
        <span>{{ demand.organizationName }}</span>
      </el-form-item>
      <el-form-item label="联系人名称">
        <span>{{ demand.contacts }}</span>
      </el-form-item>
      <el-form-item label="手机号">
        <span>{{ demand.phone }}</span>
      </el-form-item>
      <el-form-item label="收货地区">
        <span>{{ demand.area }}</span>
      </el-form-item>
      <el-form-item label="详细地址">
        <span>{{ demand.address }}</span>
      </el-form-item>
      <el-form-item label="审核状态">
        <span>{{ demand.demandStatus }}</span>
      </el-form-item>
      <div class="title small">物资需求</div>
      <el-form-item  v-for="good in demand.demandGoods" :key="good.id">
        <span>{{good.goodName}} </span><span> {{good.goodNumber ? `x ${good.goodNumber}` : "不限"}}</span> <span>备注： {{good.specification ? good.specification:"无"}}</span>
      </el-form-item>
      <el-form-item label="捐赠证明">
        <img v-for="(src,index) in images" :key="index" :src="src"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="checkdemand">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EditBar from "../../components/EditBar";
import GLOBAL from "../../utils/global";
export default {
  components: {
    EditBar
  },
  data() {
    return {
      host: GLOBAL.HOST,
      demand: {},
      images: []
    };
  },
  methods: {
    getDemandInfo() {
      this.axios({
        method: "get",
        params: {
          id: this.id
        },
        url: GLOBAL.URL.SHANYUAN.DEMAND_VIEW
      }).then(r => {
        this.demand = r.data;
        this.images = this.demand.demandImg.split(",");
      });
    },
    checkdemand() {
      this.axios({
        method: "post",
        data: {
          id: this.demand.id
        },
        url: GLOBAL.URL.SHANYUAN.DEMAND_DEMAND_CHECK
      }).then(r => {
        const { code, msg } = r || {};
        let isSuccess = code === 200;
        this.$message({
          message: isSuccess ? "审核成功" : msg,
          type: isSuccess ? "success" : "error",
          duration: 500,
          onClose: () => {
            isSuccess && this.$router.push(`/demand/list`);
          }
        });
      });
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getDemandInfo();
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
  img {
    width: 100%;
    margin-bottom: 30px;
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
