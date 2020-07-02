<template>
  <div class="withdrawal-list">
    <div class="btn-list"></div>

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
        <template slot-scope="scope">{{ scope.row.uname }}</template>
      </el-table-column>
      
      <el-table-column align="left" label="短信内容" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.content}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.createdAt}}</template>
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
    <search-bar :searchData="searchData" @handleGetList="getlist"></search-bar>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import { getTableHeight } from "@/utils";
export default {
  data() {
    return {
      pageNum: 1,
      pageTotal: 1,
      pageSize: 10,
      importDialog: false,
      tableHeight: null,
      list: [],
      data: null,
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
        }
      ]
    };
  },
  props: {
    type: String
  },
  components: {
    searchBar
  },
  methods: {
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    getlist(params) {
      if(!params) {
        params = {};
      }
      params.pageNum = this.pageNum;
      params.pageSize = this.pageSize;
      this.axios({
        method: "get",
        params,
        url: API.MESSAGE.GET_MESSAGE_UPGOING_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
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
  created() {
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
