<template>
  <div class="error-logs" id="errorLogs">
    <div class="btn-list"><el-button type="primary" size="mini" @click.native="deal">处理</el-button></div>

    <el-table
      ref="multipleTable"
      header-row-class-name="table-head"
      :data="list"
      :height="tableHeight"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="index"   label="#"  align="left"></el-table-column> -->
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <el-table-column
        align="left"
        fixed="left"
        label="接口名称"
        min-width="120px"
      >
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>

      <el-table-column align="left" min-width="120px" show-overflow-tooltip label="参数" >
        <template slot-scope="scope">{{ scope.row.params }}</template>
      </el-table-column>
      <el-table-column align="left" label="url" >
        <template slot-scope="scope">
        {{scope.row | getUrl}}
      </template>
      </el-table-column>
      <el-table-column align="left" min-width="150px" label="接口返回状态码" >
        <template slot-scope="scope">{{ scope.row.status}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="150px" show-overflow-tooltip label="接口返回信息" >
        <template slot-scope="scope">{{ scope.row.result }}</template>
      </el-table-column>
      <el-table-column align="left" label="平台名称" >
        <template slot-scope="scope">{{ scope.row.onelink.name}}</template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" >
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
      pageSize: 10,
      importDialog: false,
      tableHeight: null,
      list: [],
      searchParams: {},
      multipleSelection:[],
      data: null,
      searchData: [
        {
          name: "name",
          title: "接口名称",
          type: "inputText",
          value: ""
        },
        {
          name: "status",
          title: "接口返回状态码",
          type: "inputText",
          value: ""
        }
        ,
        {
          name: "params",
          title: "simID",
          type: "inputText",
          value: ""
        }
      ]
    };
  },
  components: {
    searchBar
  },
  filters: {
    getUrl(row) {
      return `${row.onelink.apiHost}${row.onelink.apiVersion}${row.url}`
    }
  },
  methods: {
    pageChange(val) {
      this.pageNum = val;
      this.getlist();
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for(let i = 0;i < val.length; i++) {
        this.multipleSelection.push(val[i].id)
      }
    },
    deal(){
      this.axios({
        method: "post",
        data: {
          ids: this.multipleSelection,
          isExec: 1
        },
        url: API.LOGS.DEAL_ERRORLOG
      }).then(() => {
        this.$message({
          showClose: true,
          message: '处理成功',
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
        loadEl: "#errorLogs",
        params: {
          pageNum: pageNum,
          pageSize: this.pageSize,
          ...this.searchParams,
        },
        url: API.LOGS.GET_ERRORLOGS
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
  created() {
    this.tableHeight = getTableHeight();
  }
};
</script>
<style lang="scss">
.error-logs {
  padding: 0 60px;
  font-weight: 400;
  /* .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  } */
}
</style>
