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

      <el-table-column align="left" min-width="120px" label="发送人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sender }}</template>
      </el-table-column>
      <el-table-column align="left" label="平台ID" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.orderNo}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="150px" label="接口返回状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.retcode | retcodeType}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="150px" label="接口返回描述" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.retmesg }}</template>
      </el-table-column>
      <el-table-column align="left" label="短信内容" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.content}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="接口流水号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.gwid}}</template>
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
      pageSize: 30,
      importDialog: false,
      tableHeight: null,
      list: [],
      data: null,
      searchParams: {},
      searchData: [
        {
          name: "simId",
          title: "SIM卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "senderId",
          title: "发送人",
          type: "select",
          values: [
            { value: 1, key: "激活套餐" },
            { value: 2, key: "叠加套餐" },
            { value: 3, key: "特惠套餐" }
          ],
          active: []
        },
        {
          name: "retcode",
          title: "接口返回状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: '00', key: "成功" },
            { value: '01', key: "失败" },
            { value: '02', key: "接收方号码为空" },
            { value: '03', key: "接收方号码错误" },
            { value: '04', key: "短信内容为空" },
            { value: '05', key: "鉴权ID为空" },
            { value: '06', key: "鉴权失败" }
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
  filters: {
    retcodeType(type) {
      let returnStr = "";
      // 00：成功 01：失败 02：接收方号码为空 03：接收方号码错误 04：短信内容为空 05：鉴权ID 为空 06：鉴权失败'
      switch (type) {
        case '00':
          returnStr = "成功";
          break;
        case '01':
          returnStr = "失败";
          break;
        case '02':
          returnStr = "接收方号码为空";
          break;
        case '03':
          returnStr = "接收方号码错误";
          break;
        case '04':
          returnStr = "短信内容为空";
          break;
        case '05':
          returnStr = "鉴权ID为空";
          break;
        case '06':
          returnStr = "鉴权失败";
          break;
      }
      return returnStr;
    }
  },
  methods: {
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    editCombo(row) {
      this.$router.push(`/simcombo/editinfo/${row.id}`);
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
        url: API.MESSAGE.GET_MESSAGE_SEND_LIST
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
