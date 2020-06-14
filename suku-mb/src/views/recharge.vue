<template>
  <div class="recharge">
    <div class="htmlbanner">
      <div class="recharge-top">
        <div class="recharge-top-sim">
          <div class="top-sim-icon">
            <svg-icon name="signal" class="icon-signal" />
          </div>
          <div class="top-sim-info">
            <p class="top-sim-number">{{sim.simId}}</p>
            <p class="top-sim-iccid">iccid: {{sim.iccid}}</p>
          </div>
        </div>
        <div class="recharge-top-msg">
          <svg-icon name="message" class="icon-message" />
        </div>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <van-grid :column-num="3">
          <van-grid-item>
            <p class="recharge-info-title">{{sim.activeMenuName}}</p>
            <p class="recharge-info-value">
              <van-button plain color="#e9b021" :disabled="!isActive" @click.native="renew" size="mini">续费</van-button>
            </p>
          </van-grid-item>
          <van-grid-item>
            <p class="recharge-info-title">剩余流量</p>
            <p class="recharge-info-value">{{sim.monthShengyuFlow? sim.monthShengyuFlow: '--' }} M</p>
          </van-grid-item>
          <van-grid-item>
            <p class="recharge-info-title">剩余语音</p>
            <p class="recharge-info-value">{{sim.monthShengyuVoiceDuration? sim.monthShengyuVoiceDuration: '--'}} min</p>
          </van-grid-item>
          <van-grid-item>
            <p class="recharge-info-title">开关机</p>
            <p class="recharge-info-value">{{sim.netStatus | netStatus}}</p>
          </van-grid-item>
          <van-grid-item>
            <p class="recharge-info-title">卡状态</p>
            <p class="recharge-info-value">{{sim.netStatus | netStatus}}</p>
          </van-grid-item>
          <van-grid-item>
            <p class="recharge-info-title">过期时间</p>
            <p class="recharge-info-value">{{sim.overdueTime? sim.overdueTime: '--'}}</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div class="fun-btns">
      <div class="search_c">
        <van-grid :column-num="3" clickable >
          <van-grid-item @click.native="renew" v-if="isActive">
            <p class="fun-btns-icon">
              <svg-icon name="combo" class="icon-combo" />
            </p>
            <p class="fun-btns-text">我的套餐</p>
          </van-grid-item>
          <van-grid-item :to="'/message/'+simId">
            <p class="fun-btns-icon">
              <svg-icon name="message" class="icon-telMsg" />
            </p>
            <p class="fun-btns-text">短信</p>
          </van-grid-item>
          <van-grid-item v-if="sim.simType == 'B'" :to="'/contact/'+simId" >
            <p class="fun-btns-icon">
              <svg-icon name="contact" class="icon-contact" />
            </p>
            <p class="fun-btns-text">亲情号</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div class="combos">
      <van-tabs v-model="active" :animated="true" scrollspy sticky>
        <van-tab v-for="(combo,index) in comboList" :title="combo.name" :key="index">
          <div  class="combo-packs" >
            <div  class="combo-pack" v-for="(pack,pindex) in combo.packs" @click="showPay(combo,pack)" :key="index+'_'+pindex">
              <div class="combo-pack-top">
                <p class="cpmbo-pack-name">{{pack.name}}</p>
                <p class="cpmbo-pack-flow">
                  流量:
                  <strong>{{pack.monthSumFlowThreshold}}M</strong>
                </p>
                <p class="cpmbo-pack-voice">
                  语音:
                  <strong>{{pack.monthVoiceDurationThreshold}}min</strong>
                </p>
              </div>
              <div class="combo-pack-bottom">
                售价:
                <strong>{{(pack.money-0)}}</strong> 元
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-action-sheet v-model="isShowPay" >
      <pay @clickLeft="closePay" :pay="payInfo"></pay>
    </van-action-sheet>

  </div>
</template>

<script>
import { Toast } from "vant";
import Pay from './pay';
export default {
  data() {
    return {
      simId: "",
      sim: {},
      active: 0,
      isActive: false,
      isShowPay: false,
      comboList: [],
      payInfo: {},
      myCombo: {},
    };
  },
  components:{
    Pay
  },
  filters: {
    netStatus(val) {
      console.log(val)
      return 'tingji'
    }
  },
  methods: {
    getSim() {
      this.axios({
        method: "get",
        params: {
          simId: this.simId
        },
        url: "/sim/getSim"
      }).then((r) => {
        if(r.data) {
          this.sim = r.data;
          let ids = []
          if(this.sim.isActive == 1 || this.sim.simType == 'A') {
            ids = this.sim.otherMenuIds.split(',');
          }
          //if(this.sim.simType == 'B') {
          ids.push(this.sim.activeMenuId+'')
          //}
          this.isActive = (this.sim.isActive === 1);
          this.getSimCombo(ids);
        }else{
          Toast("此卡号不是本平台的卡，请仔细检查！");
        }
      });
    },
    getSimCombo(ids) {
      this.axios({
        method: "post",
        data: {
          ids: ids
        },
        url: "/simCombo/getSimComboByIds"
      }).then((r) => {
        this.comboList = r.data
        for(let i=0; i < this.comboList.length; i++) {
          let combo = this.comboList[i]
          if(combo.comboType == 1) {
            this.myCombo = combo;
          }
          if(this.isActive && combo.comboType == 1) {
            this.comboList.splice(i,1);
            continue;
          }
          if(this.sim.simType == 'A' && combo.comboType == 1) { 
            this.comboList.splice(i,1);
            continue;
          }
          
          let packs = combo.packs
          for(let j=0;j<packs.length;j++) {
            let pack = packs[j];
            let packMoney = (pack.awardMoney-0) + (pack.money-0)
            let packMonths = (packMoney/combo.monthRent);
            pack.months = packMonths;
            if(pack.comboType == 1 || pack.comboType == 3) {
              pack.monthSumFlowThreshold =  packMonths * combo.monthSumFlowThreshold;
              pack.monthVoiceDurationThreshold = packMonths * combo.monthVoiceDurationThreshold;
            }  
          }
        }
      });
    },
    renew() {
      this.showPay();
    },
    showPay(combo, pack) {
      if(!combo) {
        combo = this.myCombo;
      }
      let pay = {}
      pay.simId = this.simId;
      pay.cname = combo.name;
      pay.cid = combo.id;
      if(pack) {
        pay.dealAmount = pack.money;
        pay.cpname = pack.name;
        pay.cpid = pack.id;
        pay.awardMoney = pack.awardMoney;
        pay.flow = pack.monthSumFlowThreshold;
        pay.voice = pack.monthVoiceDurationThreshold;
        pay.months = pack.months;
        pay.orderType = combo.comboType
      } else {
        pay.dealAmount = combo.monthRent * combo.months;
        pay.flow = combo.monthSumFlowThreshold * combo.months;
        pay.voice = combo.monthVoiceDurationThreshold * combo.months;
        pay.months = combo.months;
        pay.orderType = 4;
      }
      this.payInfo = pay;
      this.isShowPay = true;
    },
    closePay() {
      this.isShowPay = false;
      this.payInfo = {};
    }
  },
  mounted() {},
  created() {
    this.simId = this.$route.params.simId;
    this.getSim();
  }
};
</script>
<style lang="scss">
.recharge {
  padding-bottom: 40px;
  .htmlbanner {
    background: url("../assets/recharge-banner.jpg") no-repeat;
    .recharge-top {
      height: 48px;
      display: flex;
      .recharge-top-sim {
        display: flex;
        flex: 1;
        .icon-signal {
          color: #ffffff;
        }
        .top-sim-icon {
          flex: 1;
          max-width: 48px;
          text-align: center;
          line-height: 48px;
        }
        .top-sim-info {
          flex: 1;
          color: #ffffff;
          font-size: 6px;
          padding-top: 8px;
          p {
            font-size: 10px;
            line-height: 16px;
          }
        }
      }
      .recharge-top-msg {
        flex: 1;
        max-width: 48px;
        text-align: center;
        line-height: 48px;
        .icon-message {
          color: #fff;
        }
      }
    }
  }

  .search {
    margin: 0 15px;
    position: absolute;
    left: 0;
    height: auto;
    top: -34px;
    position: relative;
    box-shadow: 0px 3px 5px #ccc;
  }
  .fun-btns {
    margin: 0 15px;
    margin-top: -15px;
    .fun-btns-icon {
      height: 30px;
      line-height: 30px;
    }
    .icon-combo {
      font-size: 28px;
      color: #3888fc;
    }
    .icon-telMsg {
      font-size: 26px;
      color: #3fe2bf;
    }
    .icon-contact {
      font-size: 30px;
    }
    .van-grid-item__content::after {
      border-width: 0 1px 0 0;
    }
    .fun-btns-text {
      font-size: 12px;
    }
    .search_c .van-grid-item:nth-child(3) {
      .van-grid-item__content::after {
        border-width: 0;
      }
    }
  }
  .search_c {
    width: 100%;
    padding: 5px;
    background: #fff;
    border-radius: 5px;
    .van-hairline--top::after {
      border: 0px;
    }
    .van-grid-item__content {
      padding: 10px 8px;
    }
    .van-grid-item:nth-child(3) {
      .van-grid-item__content::after {
        border-width: 0 0 1px 0;
      }
    }
    .van-grid-item:nth-child(4) {
      .van-grid-item__content::after {
        border-width: 0 1px 0 0;
      }
    }
    .van-grid-item:nth-child(5) {
      .van-grid-item__content::after {
        border-width: 0 1px 0 0;
      }
    }
    .van-grid-item:nth-child(6) {
      .van-grid-item__content::after {
        border-width: 0;
      }
    }
  }
  .recharge-info-title {
    font-size: 12px;
  }
  .recharge-info-value {
    font-size: 12px;
    line-height: 30px;
    color: #e9b021;
  }

  .combos {
    margin-top: 15px;
    .combo-packs {
      display: flex;
      margin: 15px;
      .combo-pack {
        flex: 1;
        width: 50%;
        max-width: 50%;
        color: #fff;
        font-size: 14px;

        p {
          font-size: 14px;
          text-align: center;
          line-height: 30px;
          strong {
            font-weight: bold;
          }
        }
        .combo-pack-top {
          border-radius: 8px 8px 0 0;
          padding: 20px 0;
          background-image: linear-gradient(0deg, #ffbc05 0%, #f99710 100%);
        }
        .combo-pack-bottom {
          height: 40px;
          line-height: 40px;
          border-radius: 0 0 8px 8px;
          text-align: center;
          font-size: 14px;
          color: #646566;
          background: #fff;
          strong {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      .combo-pack:nth-child(2n - 1) {
        padding-right: 7px;
      }
      .combo-pack:nth-child(2n) {
        padding-left: 8px;
      }
    }
  }
  .van-button--disabled {
    opacity: 0.2;
  }
  .van-tab {
    max-width: 35%;
  }
  .van-popup--bottom.van-popup--round {
    border-radius: 0;
    
  }
  .van-action-sheet {
    max-height: 100%;
    height: 100%;
  }
}
</style>