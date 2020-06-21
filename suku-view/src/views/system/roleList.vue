<template>
  <div class="dashboard-container">
    <div class="btn-list"></div>
    <el-button type="primary" size="mini" @click.native="editRole()">增加</el-button>
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

      <el-table-column align="left" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.displayName}}</template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createdAt }}</template>
      </el-table-column>
      <el-table-column align="left" label="更新时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.updatedAt }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editRole(scope.row)"
            size="small"
          >编辑</el-button>
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
  methods: {
    editRole(row) {
      if (row) {
        const { id, name, displayName, level } = row;
        this.$router.push({ path: `/system/editRole/${id}`, query: { name, displayName, level }});
      } else {
        this.$router.push(`/system/editRole`);
      }
    },
    pageChange() {
      this.getlist();
    },
    editUser(user) {
      this.$router.push(`/system/edituser/${user.id}`);
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        url: API.USERS.ROLE_LIST
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
