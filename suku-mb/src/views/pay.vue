<template>
  <div class="pay">
    <div class="htmlbanner">
      <van-nav-bar title="发送短信" left-text left-arrow right-text />
      <div class="sim-content">
        <p class="sim-title">一年实惠套餐</p>
        <p class="sim-number">158</p>
      </div>
      <div class="combo-desc">
        <p class="combo-desc-item">套餐包含: 888M 59分钟</p>
        <p class="combo-desc-item">有效期: 12个月</p>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <p class="pay-title">支付方式</p>
        <p>
          <van-radio-group v-model="radio">
            <van-radio name="1" checked-color="#f99710">
              <svg-icon name="wechat"></svg-icon>
              <span style="margin-left:5px">微信支付</span>
            </van-radio>
          </van-radio-group>
        </p>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <p class="pay-comfire-text">亲爱的用户，充值购买前请认真核对卡号信息，以免发生误充，一旦误充，金额将无法退还！</p>
        <div class="pay-comfire-check">
          <p class="number">确认卡号：17288889999</p>
          <p class="redio">
            <van-radio-group v-model="radio">
              <van-radio name="1" checked-color="#f99710">
                <span style="font-size:14px;color:#2f86e0">已确认</span>
              </van-radio>
            </van-radio-group>
          </p>
        </div>
      </div>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="querySim">发送</van-button>
    </div>
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
      msg: "",
      radio: ""
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
.pay {
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
      padding: 10px 15px;
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
    .combo-desc {
      padding: 0 15px;
      .combo-desc-item {
        font-size: 10px;
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
    padding: 10px;
    background: #fff;
    border-radius: 5px;

    .pay-title {
      color: #333;
      font-size: 16px;
      line-height: 30px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .pay-comfire-text {
      font-size: 12px;
    }
    .pay-comfire-check {
      display: flex;
      line-height: 30px;
      color: #2f86e0;
      .number {
        flex: 1;
        min-width: 60%;
        text-align: left;
        font-size: 14px;
      }
      .redio {
        flex: 1;
        max-width: 76px;
        font-size: 14px;
        text-align: right;
      }
    }
  }
}
</style>