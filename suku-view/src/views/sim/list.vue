<template>
  <div class="sim-list">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" @click="importDialog = !importDialog" size="mini">导入物联卡</el-button>
      <el-button type="primary" size="mini">导出查询结果</el-button>
      <el-button type="warning" size="mini">停机</el-button>
      <el-button type="warning" size="mini">复机</el-button>
      <el-button type="warning" size="mini">强制复机</el-button>
      <el-button type="primary" size="mini">续费</el-button>
      <el-button type="primary" size="mini">短信</el-button>
      <el-button type="warning" v-if="simType == 'B'" size="mini">停语音</el-button>
      <el-button type="warning" v-if="simType == 'B'" size="mini">恢复语音</el-button>
      <el-button type="primary" size="mini">转让</el-button>
      <el-button type="primary" size="mini">续费增加</el-button>
      <el-button type="primary" size="mini">更换套餐</el-button>
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
        fixed="left"
        label="simk卡号"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.sim_id}}</template>
      </el-table-column>

      <el-table-column align="left" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.net_status }}</template>
      </el-table-column>
      <el-table-column align="left" label="开关机" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.openStatus}}</template>
      </el-table-column>
      <el-table-column align="left" label="平台状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cardStatus}}</template>
      </el-table-column>
      <el-table-column align="left" label="套餐" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.menu_name}}</template>
      </el-table-column>
      <el-table-column align="left" label="总流量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.month_sum_flow }}</template>
      </el-table-column>
      <el-table-column align="left" label="套餐流量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.menu_flow }}</template>
      </el-table-column>
      <el-table-column align="left" label="叠加流量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.overlap_flow }}</template>
      </el-table-column>
      <el-table-column align="left" label="已用流量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.month_used_flow}}</template>
      </el-table-column>
      <el-table-column align="left" label="剩余流量" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.shengyu_flow}}</template>
      </el-table-column>
      <el-table-column align="left" v-if="simType == 'B'" label="余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.month_used_flow}}</template>
      </el-table-column>
      <el-table-column align="left" v-if="simType == 'B'" label="总语音" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.month_sum_flow }}</template>
      </el-table-column>
      <el-table-column align="left" v-if="simType == 'B'" label="已用语音" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.menu_flow }}</template>
      </el-table-column>
      <el-table-column align="left" v-if="simType == 'B'" label="剩余语音" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.overlap_flow }}</template>
      </el-table-column>
      <el-table-column align="left" v-if="simType == 'B'" label="语音状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.shengyu_flow}}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType == 'b'"
        min-width="120px"
        label="平台语音状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.shengyu_flow}}</template>
      </el-table-column>
      <el-table-column align="left" label="续费价格" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.renew_price}}</template>
      </el-table-column>
      <el-table-column align="left" label="过期时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.overdue_time}}</template>
      </el-table-column>
      <el-table-column align="left" label="激活时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.active_time}}</template>
      </el-table-column>
      <el-table-column align="left" label="用户" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.username}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editSim(scope.row)" size="small">编辑</el-button>
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
        :total="data.recordTotal"
      ></el-pagination>
    </div>
    <search-bar :searchData="searchData" @handleGetList="getlist"></search-bar>

    <el-dialog :title="'导入'+ (simType == 'b' ? '主叫卡': '被叫卡')" :visible.sync="importDialog">
      <com-import :type="simType"></com-import>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import comImport from "./com-import";
import { getTableHeight } from "@/utils";
export default {
  data() {
    return {
      pageNum: 1,
      simType: "A",
      pageTotal: 1,
      pageSize: 10,
      importDialog: false,
      tableHeight: null,
      list: [],
      data: null,
      searchData: [
        {
          name: "simId",
          title: "sim卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "simIds",
          title: "sim卡段号",
          type: "inputRange",
          values: []
        },

        {
          name: "menuCard",
          title: "套餐",
          type: "inputText",
          values: ""
        },
        {
          name: "userName",
          title: "用户",
          type: "inputText",
          values: ""
        },
        {
          name: "netStatus",
          title: "状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: 1, key: "未启用" },
            { value: 2, key: "正常" },
            { value: 3, key: "停机" },
            { value: 4, key: "过期" },
            { value: 5, key: "注销" },
            { value: 6, key: "欠费" },
            { value: 7, key: "手动复机" }
          ],
          active: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          name: "isActive",
          title: "激活状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: 1, key: "已激活" },
            { value: 2, key: "未激活" }
          ],
          active: [1, 2]
        }
      ]
    };
  },
  props: {
    type: String
  },
  components: {
    searchBar,
    comImport
  },
  methods: {
    pageChange() {
      this.getlist();
    },
    editSim(row) {
      this.$router.push(`/sim/editinfo/${this.simType}/${row.sim_id}`);
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          page: this.pageNum,
          limit: this.pageSize
        },
        url: API.SIMLIST.SIM_LIST
      }).then(r => {
        this.data = r;
        this.list = r.data;
        this.pageTotal = r.data.count;
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
.sim-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow: auto;
  }
}
</style>
