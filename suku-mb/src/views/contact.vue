<template>
  <div class="message">
    <div class="htmlbanner">
      <van-nav-bar title="发送短信" left-text left-arrow right-text />
      <div class="sim-content">
        <p class="sim-title">卡号</p>
        <p class="sim-number">17245999202</p>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <van-field v-model="msg" type="tel" label="亲情号" placeholder="请输入亲情号" />
      </div>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="querySim">添加亲情号</van-button>
    </div>
    <div class="btn">
      <van-button type="primary" color="#7232dd" size="large" @click="querySim">亲情号列表</van-button>
    </div>

    <van-list>
      <van-cell title="item" />
      <van-cell title="item" />
      <van-cell title="item" />
      <van-cell title="item" />
      <van-cell title="item" />
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      simId: "",
      manualActive: 0,
      returnSim: "",
      msg: ""
    };
  },
  methods: {
    querySim() {
      if (this.simId.trim() == "") {
        Toast("请输入物联卡卡号");
        return;
      }
      this.axios({
        method: "get",
        params: {
          sim_id: this.simId
        },
        url: "/index/wechat/test-check"
      }).then(() => {
        // let data = r.data;
        // this.returnSim = data["sim_id"];
      });
    }
    /* doWechatPay(json) {
      WeixinJSBridge.invoke("getBrandWCPayRequest", json, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
        }
      });
    } */
  },
  mounted() {}
};
</script>
<style lang="scss">
.message {
  padding-bottom: 40px;
  .htmlbanner {
    background: url("../assets/ic_bj.png") no-repeat;
    background-position: bottom right;
    background-size: 90px 90px;
    background-color: #fff;
    .van-nav-bar {
      .van-nav-bar__title {
        color: #333;
      }
    }
    .sim-content {
      padding: 20px;
      .sim-title {
        color: #333;
        font-size: 18px;
        line-height: 30px;
        font-weight: bold;
      }
      .sim-number {
        font-size: 18px;
        line-height: 30px;
        font-weight: bold;
        color: #f99710;
      }
    }
  }

  .search {
    margin: 15px;
    position: relative;
    box-shadow: 0px 3px 5px #ccc;
  }
  .search_c {
    width: 100%;
    padding: 5px;
    background: #fff;
    border-radius: 5px;
  }
}
</style>