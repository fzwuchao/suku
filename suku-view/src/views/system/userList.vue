<template>
  <div class="dashboard-container" id="system-user-list">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" size="mini" @click.native="addUser">增加</el-button>
      <!--<el-button type="primary" size="mini" @click.native="openMsg">开通短信</el-button>
      <el-button type="primary" size="mini" @click.native="openAutoTransfer(1)">开启自动转账</el-button>
      <el-button type="primary" size="mini" @click.native="openAutoTransfer(0)">关闭自动转账</el-button>-->
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
      <el-table-column align="left" v-if="curUser.roleLevel == 0 || curUser.roleType == 5" label="分成率" show-overflow-tooltip>
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

      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="editUser(scope.row)" size="small">编辑</el-button>
          <el-button type="text" @click="modifyPwd(scope.row)" size="small">修改密码</el-button>
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
    <modify-pwd :dialogVisible="dialogVisible" @close="close" :userId="userId" :username="username"></modify-pwd>
    <search-bar :searchData="searchData" @handleGetList="getlist"></search-bar>
  </div>
</template>

<script>
import API from "@/api";
import ModifyPwd from "@/components/ModifyPwd";
import searchBar from "@/components/SearchBar";
import { getTableHeight } from "@/utils";
export default {
  components: {
    ModifyPwd,
    searchBar,
  },
  data() {
    return {
      username: '',
      userId: null,
      dialogVisible: false,
      pageNum: 1,
      pageTotal: 1,
      tableHeight: null,
      pageSize: 30,
      searchParams: {},
      list: [],
      data: null,
      searchData: [
        {
          name: "name",
          title: "昵称",
          type: "inputText",
          value: ""
        }
      ],
      cueUser: {},
      multipleSelection: []
    };
  },
  filters: {
    getRoleName(role) {
      return role.display_name;
    }
  },
  methods: {
    modifyPwd({ id, username }) {
      this.userId = id;
      this.username = username;
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.userId = null;
    },
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    editUser(user) {
      this.$router.push(`/system/edituser/${user.id}`);
    },
    addUser() {
      this.$router.push(`/system/adduser`);
    },
    openAutoTransfer(value) {
      this.axios({
        method: "post",
        data: {
          ids: this.multipleSelection,
          autoTransfer: value
        },
        url: API.USERS.UPDATE_AUTO_TRANSFER
      }).then(() => {
        this.$message({
          showClose: true,
          message: '设置成功',
          type: 'success'
        });
        this.getlist();
      });
    },
    openMsg(){
      this.axios({
        method: "post",
        data: {
          ids: this.multipleSelection,
          openMsg: 1
        },
        url: API.USERS.UPDATE_OPENMSG
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
        loadEl: "#system-user-list",
        params: {
          pageNum: pageNum,
          pageSize: this.pageSize,
          ...this.searchParams
        },
        url: API.USERS.USER_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for(let i = 0;i < val.length; i++) {
        this.multipleSelection.push(val[i].id)
      }
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
  created() {
    this.curUser = JSON.parse(localStorage.getItem('userInfo'));
    this.tableHeight = getTableHeight();
  }
};
</script>
<style lang="scss">
.dashboard-container {
  padding: 60px;
  font-weight: 400;
}
</style>
