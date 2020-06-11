<template>
  <div class="message">
    <div class="htmlbanner">
      <van-nav-bar title="发送短信" left-text @click-left="onClickLeft" left-arrow right-text />
      <div class="sim-content">
        <p class="sim-title">卡号</p>
        <p class="sim-number">{{simId}}</p>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <van-field v-model="msg" label="短信内容" placeholder="请输入短信内容" />
      </div>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="sendMsg">发送</van-button>
    </div>
    <div class="btn">
      <van-button type="primary" color="#7232dd" size="large" @click="getMsgList">查看发送记录</van-button>
    </div>

    <van-list>
      <van-cell v-for="(item, index) in sendList" :key="index">
        <p>{{item.content}}</p>
        <p>{{item.retcode | retcode}}</p>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      simId: "",
      msg: "",
      sendList: []
    };
  },
  filters: {
    retcode(type) {
       let returnStr = "";
      // 00：成功 01：失败 02：接收方号码为空 03：接收方号码错误 04：短信内容为空 05：鉴权ID 为空 06：鉴权失败'
      switch (type) {
        case '00':
          returnStr = "成功";
          break;
        case '01':
          returnStr = "失败";
          break;
        case '02':
          returnStr = "接收方号码为空";
          break;
        case '03':
          returnStr = "接收方号码错误";
          break;
        case '04':
          returnStr = "短信内容为空";
          break;
        case '05':
          returnStr = "鉴权ID为空";
          break;
        case '06':
          returnStr = "鉴权失败";
          break;
      }
      return returnStr;
    }
  },
  methods: {
    sendMsg() {
      this.axios({
        method: "post",
        data: {
          simId: this.simId,
          content: this.msg,
        },
        url: "/messageSend/save"
      }).then(() => {
        Toast('发送成功！')
      });
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    getMsgList() {
      this.axios({
        method: "get",
        params: {
          simId: this.simId,
        },
        url: "/messageSend/getSendlistBySimId"
      }).then((r) => {
        this.sendList = r.data;
      });
      
    }
  },
  mounted() {},
  created() {
    this.simId = this.$route.params.simId;
  }
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