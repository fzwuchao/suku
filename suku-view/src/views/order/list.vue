<template>
  <div class="sim-list">
    <div class="btn-list">
     <!-- <el-button type="primary" size="mini" @click="openWithdrawal">提现</el-button>
      <span>开启自动转账的用户所有订单提现状态都是已完成</span> -->
    </div>

    <el-table
      ref="multipleTable"
      header-row-class-name="table-head"
      :data="list"
      :height="tableHeight"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <!-- <el-table-column type="index"   label="#"  align="left"></el-table-column> -->

      <el-table-column
        align="left"
        fixed="left"
        label="SIM卡号"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.simId}}</template>
      </el-table-column>

      <el-table-column align="left" min-width="120px" label="用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.uname}}</template>
      </el-table-column>
      <el-table-column align="left" label="套餐" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cname}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="套餐包" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cpname}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="交易金额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dealAmount}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="续增金额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.renewIncrAmount}}</template>
      </el-table-column>
      <el-table-column align="left" label="订单号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.orderId }}</template>
      </el-table-column>
      <el-table-column align="left" label="订单状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.orderStatus | orderStatus }}</template>
      </el-table-column>
      <el-table-column align="left" label="微信流水号" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.wxSerialNum }}</template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createdAt }}</template>
      </el-table-column>
      <!-- <el-table-column align="left" min-width="120px" label="提现流水号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.renewPrice }}</template>
      </el-table-column> -->
      <!-- <el-table-column align="left" label="提现状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.renewPrice }}</template>
      </el-table-column> -->
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        @size-change="handleSizeChange"
        :current-page="pageNum"
        @current-change="pageChange"
        :page-sizes="[200, 500, 1000]"
        background
        layout="total,prev, pager, next, sizes"
        :page-size="data.pageSize"
        :total="data.totalRecords"
      ></el-pagination>
    </div>
    <el-dialog title="提现" :visible.sync="withdrawalDialog">
      <withdrawal :money="withdrawalMoney"></withdrawal>
    </el-dialog>
    <search-bar ref="searchBar" :searchData="searchData" @handleGetList="getlist"></search-bar>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import { getTableHeight } from "@/utils";
import Withdrawal from "./withdrawal";
export default {
  data() {
    return {
      pageNum: 1,
      orderType: 1,
      pageTotal: 1,
      pageSize: 200,
      withdrawalDialog: false,
      tableHeight: null,
      list: [],
      withdrawalMoney: '00',
      data: null,
      searchParams: {},
      searchData: [
        {
          name: "simId",
          title: "SIM卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "uid",
          title: "用户",
          type: "select",
          values: [
            { value: 1, key: "激活套餐" },
            { value: 2, key: "叠加套餐" },
            { value: 3, key: "特惠套餐" }
          ],
          active: []
        },
        {
          name: "orderStatus",
          title: "订单状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: "2", key: "成功" },
            { value: "0", key: "失败" },
            { value: "1", key: "未支付" }
          ],
          active: []
        }
      ]
    };
  },
  props: {
    type: Number
  },
  components: {
    searchBar,
    Withdrawal
  },
  filters: {
    orderStatus(val) {
      let returnStr = "";
      switch (val) {
        case 2:
          returnStr = "成功";
          break;
        case 0:
          returnStr = "失败";
          break;
        case 1:
          returnStr = "未支付";
          break;
      }
      return returnStr;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist();
    },
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    openWithdrawal() {
      this.withdrawalDialog = true;
    },
    editCombo(row) {
      this.$router.push(`/simcombo/editinfo/${row.id}`);
    },
    getlist(val) {
      let pageNum = this.pageNum;
      if (val) {
        this.searchParams = val;
        pageNum = 1;
      }
      this.axios({
        method: "get",
        params: {
          pageNum: pageNum,
          orderType: this.orderType,
          pageSize: this.pageSize,
          ...this.searchParams,
        },
        url: API.ORDER.GET_SIMORDER_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getUsers() {
      this.axios({
        method: "get",
        url: API.USERS.GET_SELECT_USERS
      }).then(r => {
        r.data.splice(0,0,{value: '',key:'全部'})
        this.searchData[1].values = r.data
      });
    }
  },
  mounted() {
    this.getlist();
    this.getUsers();
  },
  watch: {
    type: function(newVal) {
      this.orderType = newVal;
      this.pageNum = 1;
      this.getlist()
      this.$refs.searchBar.empty();
    }
  },
  created() {
    this.orderType = this.type;
    this.tableHeight = getTableHeight();
  }
};
</script>
<style lang="scss">
.sim-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow: auto;
  }
}
</style>
