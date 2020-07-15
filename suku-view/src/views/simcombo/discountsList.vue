<template>
  <div class="discounts-list">
    <div class="btn-list">
      <!-- <el-button type="primary" @click="checkDemand">审核</el-button> -->
      <el-button type="primary" size="mini" @click="editCombo()">新增</el-button>
      <!--<el-button type="primary" size="mini">删除</el-button>-->
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
        label="套餐名称"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column
        align="left"
        fixed="left"
        label="套餐别名"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.displayName}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="适用卡类型" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.belongsToSimType | simType }}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120px" label="添加时间" show-overflow-tooltip>
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
      comboType: 3,
      pageSize: 10,
      importDialog: false,
      tableHeight: null,
      list: [],
      data: null,
      searchData: [
        {
          name: "name",
          title: "套餐名称",
          type: "inputText",
          value: ""
        },
        {
          name: "belongsToSimType",
          title: "适用卡类型",
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
  filters: {
    comboType(type) {
      type = type - 0;
      let returnStr = "";
      switch (type) {
        case 1:
          returnStr = "激活套餐";
          break;
        case 2:
          returnStr = "叠加套餐";
          break;
        case 3:
          returnStr = "特惠套餐";
          break;
      }
      return returnStr;
    },
    simType(val) {
      let types = val.split(",");
      let returnStr = "";
      for (let i = 0; i < types.length; i++) {
        if (types[i] == "A") {
          returnStr += "被叫卡";
        }
        if (types[i] == "B") {
          returnStr += " 主叫卡";
        }
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
      if (row === undefined) {
        this.$router.push(`/simcombo/editDiscounts`);
      } else {
        this.$router.push(`/simcombo/editDiscounts/${row.id}`);
      }
    },
    getlist(val) {
      let params = {}
      if (val) params = { ...val };
      this.axios({
        method: "get",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          comboType: this.comboType,
          ...params
        },
        url: API.SIMCOMBO.SIM_COMBO_LIST
      }).then(r => {
        this.data = r.data;
        this.list = r.data.list;
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
.discounts-list {
  padding: 0 60px;
  font-weight: 400;
  .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
