<template>
  <div class="withdrawal-list">
    <div class="btn-list">
      <el-button type="primary" size="mini">导出查询结果</el-button>
      <el-button type="primary" size="mini">完成查询结果</el-button>
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
        label="流水号"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.id}}</template>
      </el-table-column>

      <el-table-column align="left" min-width="120px" label="用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.uname }}</template>
      </el-table-column>
      <el-table-column align="left" label="提现金额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.amount}}</template>
      </el-table-column>
      <el-table-column align="left" label="账户号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account}}</template>
      </el-table-column>
      <el-table-column align="left" label="账户名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.accName}}</template>
      </el-table-column>
      <el-table-column align="left" label="开户行" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.accAddr}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="提现时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createdAt}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.status | status}}</template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        :current-page="pageNum"
        @current-change="pageChange"
        :page-sizes="[20, 30, 50, 100]"
        background
        layout="total,prev, pager, next"
        :page-size="data.pageSize"
        :total="data.totalRecords"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import API from "@/api";
export default {
  data() {
    return {
      pageNum: 1,
      pageTotal: 1,
      pageSize: 30,
      tableHeight: null,
      list: [],
      data: null,
    }
  },
  filters: {
    status(status) {
      return {
        1: '未处理',
        2: '已处理',
      }[status]
    }
  },
  methods: {
    pageChange() {
      this.getlist();
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        url: API.WITHDRAWAL.GET_WD_RECORD
      }).then(r => {
        this.data = r.data;
        this.list = r.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    
  },
  mounted() {
    this.getlist();
  },
};
</script>
<style lang="scss">
.withdrawal-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
