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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <!-- <el-table-column type="index"   label="#"  align="left"></el-table-column> -->

      <el-table-column
        align="left"
        fixed="left"
        label="流水号"
        min-width="150px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.flowNo}}</template>
      </el-table-column>

      <el-table-column align="left" min-width="120px" label="发卡用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sender}}</template>
      </el-table-column>
      <el-table-column align="left" label="收卡用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.receiver}}</template>
      </el-table-column>
      <el-table-column align="left" label="数量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.total}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="150px" label="物流单号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.logisticsNo}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.phone}}</template>
      </el-table-column>
      <el-table-column align="left" label="地址" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.address}}</template>
      </el-table-column>
      <el-table-column align="left" label="添加时间" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createdAt}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editCombo(scope.row)" size="small">编辑</el-button>
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
      tableHeight: null,
      list: [],
      data: null,
      searchData: [
        {
          name: "flowNo",
          title: "流水号",
          type: "inputText",
          value: ""
        },
        {
          name: "sender",
          title: "发卡用户",
          type: "inputText",
          value: ""
        },
        {
          name: "receiver",
          title: "收卡用户",
          type: "inputText",
          value: ""
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
    pageChange() {
      this.getlist();
    },
    editCombo(row) {
      this.$router.push(`/warehouse/editInfo/${row.id}`);
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
        url: API.SIMLOGISTICS.GET_SIMLOGISTICS_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    overflow: auto;
  }
}
</style>
