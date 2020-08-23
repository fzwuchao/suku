<template>
  <div class="sim-list" id="order-list">
    <div class="btn-list">
     <span :style="{marginRight: '20px'}">{{`可提现金额：${totalWithdrawalMoney}`}}</span>
     <el-button type="primary" size="mini" @click="openWithdrawal">提现</el-button>
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
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        @size-change="handleSizeChange"
        :current-page="pageNum"
        @current-change="pageChange"
        :page-sizes="[50, 100, 200, 300, 400]"
        background
        layout="total,prev, pager, next, sizes"
        :page-size="data.pageSize"
        :total="data.totalRecords"
      ></el-pagination>
    </div>
    <el-dialog title="提现" :visible.sync="withdrawalDialog">
      <withdrawal :money="withdrawalMoney" :orderIds="orderIds"></withdrawal>
    </el-dialog>
    
  </div>
</template>

<script>
import API from "@/api";
import { getTableHeight } from "@/utils";
import Withdrawal from "./withdrawal";
export default {
  data() {
    return {
      pageNum: 1,
      pageTotal: 1,
      pageSize: 50,
      withdrawalDialog: false,
      tableHeight: null,
      list: [],
      withdrawalMoney: 0,
      totalWithdrawalMoney: 0,
      data: null,
      multipleSelection: [],
      orderIds: '',
    }
  },
  components: {
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
    check() {
      const isOpen = (this.multipleSelection || []).length > 0;
      if (!isOpen) {
        this.$message({
          message: '请先勾选要提现的订单',
          type: 'warning',
        })
      }
      return isOpen;
    },
    openWithdrawal() {
      this.check() && (this.withdrawalDialog = true);
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
          pageSize: this.pageSize,
        },
        url: API.WITHDRAWAL.GET_WD_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
        this.totalWithdrawalMoney = this.data.rateAmount || 0;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    
  },
  watch: {
    multipleSelection(val) {
      let orderIds = [];
      let amount = val.reduce((acc, current) => {
        orderIds.push(current['id'])
        acc += current['rateAmount'];
        return acc;
      }, 0);
      this.withdrawalMoney = amount;
      this.orderIds = orderIds.join(',');
    }
  },
  mounted() {
    this.getlist();
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
