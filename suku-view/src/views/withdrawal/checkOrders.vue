<template>
  <div class="sim-list" id="check-order-list">
    <div class="btn-list">
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
    >
      <el-table-column
        align="left"
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
      
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        @size-change="handleSizeChange"
        :current-page="pageNum"
        @current-change="pageChange"
        :page-sizes="[30, 100, 200, 300, 400]"
        background
        layout="total,prev, pager, next, sizes"
        :page-size="data.pageSize"
        :total="data.totalRecords"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import API from "@/api";
import { getTableHeight } from "@/utils";
export default {
  data() {
    return {
      pageNum: 1,
      orderType: 1,
      pageTotal: 1,
      pageSize: 30,
      withdrawalId: null,
      tableHeight: null,
      list: [],
      data: null,
    };
  },
  props: {
    wId: Number
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
    getlist(val) {
      let pageNum = this.pageNum;
      if (val) {
        this.searchParams = val;
        pageNum = 1;
      }
      this.axios({
        method: "get",
        loadEl: "#check-order-list",
        params: {
          pageNum: pageNum,
          withdrawalId: this.withdrawalId,
          pageSize: this.pageSize
        },
        url: API.WITHDRAWAL.CHECK_ORDERS
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    }
  },
  mounted() {
    this.getlist();
  },
  watch: {
    wId: function(newVal) {
      this.pageNum = 1;
      this.withdrawalId = newVal;
      this.getlist()
    }
  },
  created() {
    this.withdrawalId = this.wId;
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
