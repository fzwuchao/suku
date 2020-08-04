<template>
  <div class="sim-write-list">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <!--<el-button type="primary" size="mini">删除</el-button> -->
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
    >
      <!-- <el-table-column type="index"   label="#"  align="left"></el-table-column> -->

      <el-table-column align="left" label="simk卡号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.simId}}</template>
      </el-table-column>
      <el-table-column align="left" label="用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.uname }}</template>
      </el-table-column>
      <el-table-column align="left" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.phone}}</template>
      </el-table-column>
      <el-table-column align="left" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.status | getStatus}}</template>
      </el-table-column>
      <el-table-column align="left" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createdAt}}</template>
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
      pageSize: 30,
      importDialog: false,
      tableHeight: null,
      list: [],
      data: null,
      searchParams: {},
      searchData: [
        {
          name: "simId",
          title: "sim卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "status",
          title: "亲情号状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: "0", key: "失效" },
            { value: "1", key: "生效" },
            { value: "2", key: "处理中" }
          ],
          active: [0, 1, 2, 3, 4, 5, 6, 7]
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
  filters: {
    getStatus(val) {
      const values = {
        1: '生效',
        0: '失效',
        2: '处理中'
      }
      return values[val];
    }
  },
  methods: {
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
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
          ...this.searchParams,
        },
        url: API.SIMLIST.WRITE_LIST
      }).then(r => {
        this.data = r.data;
        this.list = this.data.list;
        this.pageTotal = this.data.totalRecords;
      });
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
.sim-write-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
