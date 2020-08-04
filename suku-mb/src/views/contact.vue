<template>
  <div class="contact">
    <div class="htmlbanner">
      <van-nav-bar title="添加亲情号" @click-left="onClickLeft" left-text left-arrow right-text />
      <div class="sim-content">
        <p class="sim-title">卡号</p>
        <p class="sim-number">{{simId}}</p>
        <p class="tips">每隔3分钟后再添加一个亲情号码，请耐心操作</p>
      </div>
    </div>
    <div class="search">
      <div class="search_c">
        <van-field v-model="phone" type="tel" label="亲情号" placeholder="请输入亲情号" />
      </div>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="onclickAddContact">添加亲情号</van-button>
    </div>
    <!--<div class="btn">
      <van-button type="primary" color="#7232dd" size="large" @click="getContactList">亲情号列表</van-button>
    </div>-->

    <van-list>
      <van-cell v-for="(item, index) in writeList" :key="index">
        <p class="write-list-item"><span class="item-phone">{{item.phone}}</span><span v-bind:class="{ 'item-success': item.status==1, 'item-deal': item.status==2}" class="item-status">{{item.status | getStatus}}</span></p>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import { debounce } from '../utils/throttle-debounce';
export default {
  data() {
    return {
      simId: "",
      returnSim: "",
      phone: "",
      debounceFun: null,
      writeList:[]
    };
  },
  filters: {
    getStatus(val) {
      let str = '';
      const status= {
        '1' : "生效",
        '2' : "处理中"
      }
      str = status[val];
      return str;
    }
  },
  methods: {
    addContact() {
      if(this.phone.trim() === '') {
        Toast('请输入要添加的亲情号码！')
        return ;
      }
      this.axios({
        method: "post",
        data: {
          simId: this.simId,
          phone: this.phone,
        },
        url: "/writeList/save"
      }).then(() => {
        this.getContactList();
        Toast('亲情号处理中，请耐心等待，请3分钟后操作下一个亲情号!')
      });
    },
    onclickAddContact () {
      this.debounceFun()
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    getContactList() {
      this.axios({
        method: "get",
        params: {
          simId: this.simId,
        },
        url: "/writeList/getWriteListBySimId"
      }).then((r) => {
        this.writeList = r.data;
      });
      
    }
  },
  mounted() {
    this.debounceFun = debounce(1000*60*3, true, this.addContact)
  },
  created() {
    this.simId = this.$route.params.simId;
    this.getContactList();
  }
};
</script>
<style lang="scss">
.contact {
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
      .tips {
        font-size: 12px;
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

  .write-list-item {
    display: flex;
    .item-phone {
      flex: 2;
    }
    .item-status {
      flex: 1;
      font-size: 12px;
    }
    .item-deal {
      color: #f99710;
    }
    .item-success {
      color: green;
    }
  }
}
</style>