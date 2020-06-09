<template>
  <div class="home-vue">
    <div class="htmlbanner">
      <van-nav-bar title="SIM卡查询" left-text right-text />
    </div>
    <div class="search">
      <div class="search_c">
        <div class="input">
          <input type="tel" placeholder="请输入物联卡卡号：" v-model="simId" />
        </div>
        <span>
          <img src="../assets/ic1.jpg" alt />
        </span>
      </div>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="querySim">确定</van-button>
    </div>
    <input type="hidden" id="active_sim_id" />

    <div class="Tips">
      <p>
        温馨提示:
        <br />一：续费和叠加前先查询卡的状态和到期时间
        <br />二：SIM卡因为没流量导致停机，请选择流量叠加包
        <br />三：SIM卡因为到期导致停机，请选择续费按钮。
        <br />四：SIM卡因为语音导致停机，请选择语音叠加包
        <br />五：请仔细核对卡号，如果误充值将无法退换。
        <br />六：公众号使用视频教程建议观看。
      </p>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { validateTel } from "../utils/validate"
export default {
  data() {
    return {
      simId: "",
      manualActive: 0,
      returnSim: "",
      show: false,
      virtualChild: []
    };
  },
  methods: {
    querySim() {
      if (this.simId.trim() == "") {
        Toast("请输入物联卡卡号");
        return;
      }
      if(!validateTel(this.simId)) {
        Toast("请输入正确的卡号");
        return;
      }
      // this.$router.push("/recharge");
      /* this.axios({
        method: "get",
        params: {
          simId: this.simId
        },
        url: "/index/wechat/test-check"
      }).then(() => {
        // let data = r.data;
        // this.returnSim = data["sim_id"];
      }); */
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
.home-vue {
  padding-bottom: 40px;
  .yidong_banner {
    width: 100%;
    img {
      max-width: 100%;
    }
  }
  .html_top {
    height: 0.7rem;
    line-height: 0.7rem;
    position: relative;
  }
  .search {
    margin: 0 15px;
    height: 78px;
    position: relative;
  }
  .search_c {
    width: 100%;
    height: 78px;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: -39px;
    display: flex;
    .input {
      flex: 4;
      padding-left: 10px;
      line-height: 78px;
      input {
        font-size: 16px;
      }
    }
    span {
      flex: 1;
      img {
        width: 22px;
        height: 22px;
        margin-top: 28px;
      }
    }
  }
  .van-nav-bar {
    background: transparent;
  }

  .Tips {
    margin: 0 15px;
    height: auto;
    overflow: hidden;
    border-radius: 6px;
    background: #ffffef;
    padding: 10px 16px;
  }
  .Tips p {
    color: #333;
    font-size: 12px;
    line-height: 24px;
    color: #666;
  }
  .Tips p strong {
    font-weight: bold;
    color: #287fdf;
  }
}
</style>