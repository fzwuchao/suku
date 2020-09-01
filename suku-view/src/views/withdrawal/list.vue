<template>
  <div class="withdrawal-list">
    <div class="btn-list">
      <el-button type="primary" v-if="isSysManager" size="mini" @click="handleExport">导出处理</el-button>
      <!-- <el-button type="primary" size="mini">完成查询结果</el-button> -->
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
      <el-table-column  label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="checkOrders(scope.row)" size="small">核对订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        :current-page="pageNum"
        @current-change="pageChange"
        @size-change="handleSizeChange"
        :page-sizes="[50, 100, 200, 300]"
        background
        layout="total,prev, pager, next, sizes"
        :page-size="data.pageSize"
        :total="data.totalRecords"
      ></el-pagination>
    </div>
    <search-bar :searchData="searchData" @handleGetList="getlist"></search-bar>
    <el-dialog title="核对订单" :visible.sync="checkOrdersDialog">
      <checkOrders :wId="wId" ></checkOrders>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import checkOrders from "./checkOrders"
export default {
  components: {
    searchBar,
    checkOrders,
  },
  data() {
    return {
      pageNum: 1,
      pageTotal: 1,
      pageSize: 50,
      tableHeight: null,
      list: [],
      wId: null,
      isSysManager: false,
      checkOrdersDialog: false,
      searchParams: {},
      searchData: [
        {
          name: "uname",
          title: "用户",
          type: "inputText",
          value: ""
        },
        {
          name: "status",
          title: "状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: "1", key: "未处理" },
            { value: "2", key: "已处理" },
          ],
          active: [1, 2]
        }
      ],
      data: null,
      ids: [],
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist();
    },
    pageChange() {
      this.getlist();
    },
    checkOrders(row) {
      this.wId = row.id;
      this.checkOrdersDialog = true;
    },
    getRoleType() {
      this.curUser = JSON.parse(localStorage.getItem('userInfo'));
      this.isSysManager =(this.curUser.roleLevel === 1 || this.curUser.roleLevel === 0);
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
          ...this.searchParams
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
      this.ids = this.multipleSelection.map(item => item.id)
    },
    handleExport() {
      if (this.ids.length === 0) {
        this.$message({
          message: '请勾选要提现的记录',
          type: 'warning',
        })
        return;
      }

      
      this.axios({
        method: "post",
        data: {
          ids: this.ids.join(',')
        },
        responseType: "blob",
        url: API.WITHDRAWAL.EXPORT
      }).then(r => {
        this.download(r, '提现记录', "xlsx");
        this.getlist();
      });
    },
    download(data, fileName, suffix) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName + "." + suffix);
      document.body.appendChild(link);
      link.click();
      //释放资源
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
  },
  mounted() {
    this.getlist();
    this.getRoleType();
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
