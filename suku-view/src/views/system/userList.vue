<template>
  <div class="dashboard-container">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" size="mini" @click.native="addUser">增加</el-button>
      <el-button type="primary" size="mini">开通短信</el-button>
      <el-button type="primary" size="mini">开启自动转账（只有管理员才有权限）</el-button>
    </div>

    <el-table
      ref="multipleTable"
      header-row-class-name="table-head"
      :data="list"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <!-- <el-table-column type="index"   label="#"  align="left"></el-table-column> -->

      <el-table-column align="left" label="登陆账号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.username}}</template>
      </el-table-column>
      <el-table-column align="left" label="昵称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="left" label="电话" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="left" label="角色" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.role.displayName}}</template>
      </el-table-column>
      <el-table-column align="left" label="分成率" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.rate }}</template>
      </el-table-column>
      <el-table-column align="left" label="商户号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.mchId }}</template>
      </el-table-column>
      <el-table-column align="left" label="短信" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.openMsg == 1? '已开通':'未开通' }}</template>
      </el-table-column>
      <el-table-column align="left" label="自动转账" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.autoTransfer == 1? '已开通':'未开通' }}</template>
      </el-table-column>
      <el-table-column align="left" label="上级" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.pname}}</template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editUser(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        :current-page="data.pageNum"
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
      pageSize: 10,
      list: [],
      data: null,
      multipleSelection: []
    };
  },
  filters: {
    getRoleName(role) {
      debugger
      return role.display_name;
    }
  },
  methods: {
    pageChange() {
      this.getlist();
    },
    editUser(user) {
      this.$router.push(`/system/edituser/${user.id}`);
    },
    addUser() {
      this.$router.push(`/system/adduser`);
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        url: API.USERS.USER_LIST
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
  }
};
</script>
<style lang="scss">
.dashboard-container {
  padding: 60px;
  font-weight: 400;
}
</style>
