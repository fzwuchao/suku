<template>
  <div class="combo-pack-list">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" size="mini">新增</el-button>
      <el-button type="primary" size="mini">删除</el-button>
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
        label="套餐包名"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column align="left" label="所属套餐" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.simcombo}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="金额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.money }}</template>
      </el-table-column>
      <el-table-column align="left" label="赠送金额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.award_money}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.monthMin}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editPack(scope.row)" size="small">编辑</el-button>
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
          title: "套餐包名",
          type: "inputText",
          value: ""
        },
        {
          name: "isActive",
          title: "套餐",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: "A", key: "被叫卡" },
            { value: "B", key: "主叫卡" }
          ],
          active: ["A", "B"]
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
    editPack(row) {
      this.$router.push(`/simcombo/editPack/${row.id}`);
    },
    getlist() {
      this.axios({
        method: "get",
        params: {
          page: this.pageNum,
          limit: this.pageSize
        },
        url: API.SIMCOMBO.COMBO_PACK_LIST
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
.combo-pack-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
