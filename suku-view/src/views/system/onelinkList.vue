<template>
  <div class="dashboard-container">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" size="mini" @click="addOnelink">增加</el-button>
      <el-button type="primary" size="mini" @click="openStatus(1)">启用</el-button>
      <el-button type="primary" size="mini" @click="openStatus(0)">停用</el-button>
      <el-button type="primary" size="mini" @click="getToken">手动获取token</el-button>
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

      <el-table-column align="left" label="企业名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column align="left" label="appId" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.appId }}</template>
      </el-table-column>
      <el-table-column align="left" label="apiHost" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.apiHost}}</template>
      </el-table-column>
      <el-table-column align="left" label="接口版本号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.apiVersion }}</template>
      </el-table-column>
       <el-table-column align="left" label="平台账号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.loginName }}</template>
      </el-table-column>
       <el-table-column align="left" label="平台密码" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.loginPws }}</template>
      </el-table-column>
      <el-table-column align="left" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.status == 1? '已启用':'已停用'}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editOnelink(scope.row)" size="small">编辑</el-button>
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
      searchParams: {},
      list: [],
      data: null,
      multipleSelection: []
    };
  },
  methods: {
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    editOnelink(user) {
      this.$router.push(`/system/editonelink/${user.id}`);
    },
    addOnelink() {
      this.$router.push(`/system/addonelink`);
    },
    openStatus(value) {
      this.axios({
        method: "post",
        data: {
          ids: this.multipleSelection,
          status: value
        },
        url: API.ONELINK.UPDATE_STATUS
      }).then(() => {
        this.$message({
          showClose: true,
          message: '设置成功',
          type: 'success'
        });
        this.getlist();
      });
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
        url: API.ONELINK.SEARCH_ONELINK
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    getToken() {
      this.axios({
        method: "get",
        url: API.ONELINK.GET_ONELINK_TOKEN
      }).then(() => {
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for(let i = 0;i < val.length; i++) {
        this.multipleSelection.push(val[i].id)
      }
    },
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
