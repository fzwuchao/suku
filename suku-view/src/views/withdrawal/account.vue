<template>
  <div class="withdrawal-list">
    <div class="btn-list">
      <el-button type="primary" size="mini" @click="addAccount">新增</el-button>
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
        label="别名"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.aliasName}}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="账户名"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.acName}}</template>
      </el-table-column>

      <el-table-column align="left" min-width="120px" label="账户号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column align="left" label="开户行" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.acAddr }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAccount(scope.row)" size="small">编辑</el-button>
        </template>
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

    <el-dialog title="账户信息" @close="cancelAccount" :visible.sync="dialogFormVisible">
      <edit-account :dataAccount="account" ref="editAccount" @complateAc="complateAc"></edit-account>
    </el-dialog>


  </div>
</template>

<script>
import API from "@/api";
import editAccount from "./editAccount";
import { getTableHeight } from "@/utils";
export default {
  data() {
    return {
      pageNum: 1,
      simType: "A",
      pageTotal: 1,
      pageSize: 30,
      importDialog: false,
      tableHeight: null,
      account:null,
      list: [],
      data: null,
      dialogFormVisible: false,
    };
  },
  props: {
    type: String
  },
  components:{
    editAccount
  },
  methods: {
    pageChange() {
      this.getlist();
    },
    editAccount(row) {
      this.account = row;
      this.dialogFormVisible = true;
    },
    addAccount() {
      this.account= {
        id: null,
        aliasName: '',
        acName: '',
        account: '',
        acAddr: ''
      }
      this.dialogFormVisible = true;
    },
    cancelAccount() {
      this.$refs["editAccount"].resetForm();
    },
    complateAc() {
      this.dialogFormVisible = false;
      this.getlist();
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        url: API.WITHDRAWAL.GET_ACCOUNT_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    viewItem(item, column, event) {
      const { type } = event;
      // type === 'selection'表示是点击了选择框
      type !== "selection" &&
        this.$router.push(`/demand/demanddetail/${item.id}`);
    }
  },
  mounted() {
    this.getlist();
  },
  watch: {
    type: function(newVal) {
      this.simType = newVal;
    }
  },
  created() {
    this.simType = this.type;
    this.tableHeight = getTableHeight();
  }
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
