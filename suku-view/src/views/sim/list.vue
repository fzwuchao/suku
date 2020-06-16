<template>
  <div class="sim-list">
    <div class="btn-list">
      <el-button
        type="primary"
        @click="importDialog = !importDialog"
        size="mini"
      >导入物联卡</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleExport"
      >导出查询结果</el-button>
      <el-button
        type="warning"
        size="mini"
        @click="activate(false)"
      >停机</el-button>
      <el-button
        type="warning"
        size="mini"
        @click="activate(true)"
      >复机</el-button>
      <el-button
        type="primary"
        size="mini"
      >续费</el-button>
      <el-button
        type="warning"
        v-if="simType === 'B'"
        size="mini"
      >停语音</el-button>
      <el-button
        type="warning"
        v-if="simType === 'B'"
        size="mini"
      >恢复语音</el-button>
      <el-button
        type="primary"
        size="mini"
      >转让</el-button>
      <el-button
        type="primary"
        size="mini"
      >续费增加</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleComboChange"
      >更换套餐</el-button>
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
      <el-table-column
        type="selection"
        align="center"
        fixed="left"
        width="55"
      ></el-table-column>

      <el-table-column
        align="left"
        fixed="left"
        label="Sim卡号"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.simId}}</template>
      </el-table-column>

      <el-table-column
        align="left"
        label="平台状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.cardStatus | cardStatus}}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="激活套餐名"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.activeComboName}}</template>
      </el-table-column>

      <el-table-column
        align="left"
        label="激活时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.activeTime }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="过期时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.overdueTime }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="续费价格"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.renewPrice }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="增续价格"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.privateMoney }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="用户"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.uname }}</template>
      </el-table-column>

      <el-table-column
        align="left"
        label="当月流量阈(M)"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthFlow ? scope.row.monthFlow : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="叠加流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthOverlapFlow ? scope.row.monthOverlapFlow : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="已用流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthUsedFlow ? scope.row.monthUsedFlow : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="剩余流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthShengyuFlow}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="余额(元)"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.shengyuMoney ? scope.row.shengyuMoney : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="当月语音(分)"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthVoice ? scope.row.monthVoice : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="叠加语音(分)"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthOverlapVoiceDuration ? scope.row.monthOverlapVoiceDuration : 0}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="已用语音(分)"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthUsedVoiceDuration ? scope.row.monthUsedVoiceDuration : 0}` }}</template>

      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="当月剩余语音(分)"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.monthShengyuVoiceDuration }` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="流量服务状态"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.flowServStatus | serveStatus}}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="语音服务状态"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.voiceServStatus | serveStatus }}</template>
      </el-table-column>

      <el-table-column
        align="left"
        label="开关机状态"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.openStatus == 0 ? '关机' : '开机'  }}</template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editSim(scope.row)"
            size="small"
          >编辑</el-button>
          <el-button
            type="text"
            @click="syncOnelink(scope.row)"
            size="small"
          >同步更新</el-button>
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
    <search-bar
      :searchData="searchData"
      @handleGetList="getlist"
    ></search-bar>

    <el-dialog
      :title="'导入'+ (simType === 'B' ? '主叫卡': '被叫卡')"
      :visible.sync="importDialog"
    >
      <com-import
        :type="simType"
        @close="close"
      ></com-import>
    </el-dialog>
    <el-dialog
      title="更换套餐"
      :visible.sync="comboDialog"
    >
      <combo-change
        :type="simType"
        :simIds="simIds"
        @close="closeComboChange"
      ></combo-change>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import comImport from "./com-import";
import comboChange from "./combo-change";
import { getTableHeight } from "@/utils";
export default {
  data() {
    return {
      multipleSelection: [],
      pageNum: 1,
      simType: "A",
      mapSimTypeToName: { A: "被叫卡", B: "主叫卡" },
      pageSize: 10,
      importDialog: false,
      comboDialog: false,
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
          name: "simIdRange",
          title: "sim卡段号",
          type: "inputRange",
          values: []
        },

        {
          name: "activeComboName",
          title: "套餐",
          type: "inputText",
          values: ""
        },
        {
          name: "uname",
          title: "用户",
          type: "inputText",
          values: ""
        },
        {
          name: "cardStatus",
          title: "平台状态",
          type: "select",
          values: [
            { value: "", key: "全部" },
            { value: "1", key: "待激活" },
            { value: "2", key: "已激活" },
            { value: "20", key: "停机" },
            { value: "4", key: "停机" },
            { value: "21", key: "注销" },
            { value: "6", key: "可测试" },
            { value: "22", key: "欠费" }
          ],
          active: [1, 2, 3, 4, 5, 6, 7]
        }
      ]
    };
  },
  props: {
    type: String
  },
  computed: {
    simIds() {
      const simIds = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        simIds.push(this.multipleSelection[i].simId);
      }
      return simIds;
    }
  },
  filters: {
    cardStatus(val) {
      const status = {
        "1": "待激活",
        "2": "已激活",
        "4": "停机",
        "6": "可测试",
        "21": "注销",
        "22": "欠费"
      };
      return status[val];
    },
    serveStatus(val) {
      const serveStatus = {
        1: "开",
        2: "关"
      };
      return serveStatus[val];
    }
  },
  components: {
    searchBar,
    comImport,
    comboChange
  },

  methods: {
    activate(isActivated) {
      // 对应要复机/停机的卡的状态
      const handlingSimStatus = isActivated ? "4" : "2";
      const statusError = {
        "4": "只有已停机的卡才可以复机，请确认所选的卡都是已停机状态",
        "2": "只有已激活的卡才可以停机，请确认所选的卡都是已激活状态"
      };
      if (!this.checkStatus(handlingSimStatus)) {
        this.$message({
          type: "warning",
          message: statusError[handlingSimStatus]
        });
        return;
      }
      // 对应复机/停机后卡的状态
      const cardStatus = isActivated ? "2" : "4";
      this.confirm(`是否批量${isActivated ? "复机" : "停机"}选中的卡`, () => {
        this.batchUpdate({
          cardStatus
        });
      });
    },
    confirm(message, callback) {
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          callback();
        })
        .catch(() => {});
    },
    checkStatus(cardStatus) {
      return this.multipleSelection.every(item => {
        return item.cardStatus === cardStatus;
      });
    },
    // isSamePlatform() {
    //   return this.multipleSelection.every(item => {
    //     return item.cardStatus === cardStatus;
    //   });
    // },
    batchUpdate(data) {
      this.axios({
        method: "post",
        data: {
          simIds: this.simIds,
          ...data
        },
        url: API.SIMLIST.SIM_BATCH_UPDATE
      }).then(() => {
        this.$router.push(`/sim/list/${this.simType}`);
      });
    },
    download(data, fileName, suffix) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName + "." + suffix);
      document.body.appendChild(link);
      link.click();
      //释放资源
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    syncOnelink(item) {
      this.axios({
        method: "get",
        params: {
          simType: this.simType,
          simId: item.simId
        },
        url: API.SIMLIST.SIM_SYNC_UPDATE
      }).then(r => {
        if (r.success) {
          this.getlist();
          return;
        }
        this.$message({
          message: "同步更新失败",
          type: "error"
        });
      });
    },
    handleExport() {
      this.axios({
        methods: "get",
        params: {
          simType: this.simType,
          ...this.searchParams
        },
        responseType: "blob",
        url: API.SIMLIST.SIM_EXPORT
      }).then(r => {
        this.download(r, `${this.mapSimTypeToName[this.simType]}`, "xlsx");
      });
    },
    close() {
      this.importDialog = false;
      this.getlist();
    },
    closeComboChange() {
      this.comboDialog = false;
      this.reset();
      this.getlist();
    },
    handleComboChange() {
      this.comboDialog = this.checkIsSelected();
    },
    reset() {
      this.multipleSelection = [];
    },
    pageChange() {
      this.getlist();
    },
    editSim(row) {
      this.$router.push(`/sim/editinfo/${this.simType}/${row.simId}`);
    },
    getlist(val) {
      if (val) {
        this.searchParams = val;
      }
      this.axios({
        method: "get",
        params: {
          simType: this.simType,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.searchParams
        },
        url: API.SIMLIST.SIM_LIST
      }).then(r => {
        this.data = r.data;
        this.list = r.data.list;
      });
    },
    checkIsSelected() {
      const isSelected = this.multipleSelection.length > 0;
      if (!isSelected) {
        this.$message({
          message: "请勾选要更换套餐的Sim卡!",
          type: "warning"
        });
      }
      return isSelected;
    },
    handleSelectionChange(val) {
      console.log("val:", val);
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
      const isSame = this.simType === newVal;
      this.simType = newVal;
      !isSame && this.getlist();
      // 由于动态展示列表字段，当被叫卡切换到主叫卡时，主叫卡的数据部份top,height计算不对，导致未显示出来
      this.$nextTick(() => {
        this.$refs["multipleTable"].doLayout();
      });
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
