<template>
  <div class="sim-list" id="sim-list">
    <div class="btn-list">
      <el-button
        type="primary"
        v-if="isSysManager"
        @click="importDialog = !importDialog"
        size="mini"
      >导入物联卡</el-button>
      <el-button
        type="primary"
        v-if="isSysManager && isShowTransforBtn"
        @click="importDialogForTransfor = !importDialogForTransfor"
        size="mini"
      >导入物联卡(迁移)</el-button>
      <el-button
        type="primary"
        v-if="isSysManager && isShowTransforBtn"
        @click="migrationSyncUpdate"
        size="mini"
      >同步更新(迁移)</el-button>

      <el-button
        type="primary"
        v-if="isSysManager && isShowTransforBtn"
        @click="configLimtValue"
        size="mini"
      >设置阀值</el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="isSysManager"
        @click="handleExport"
      >导出查询结果</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="isSysManager"
        @click="iccidSyncUpdate"
      >获取iccid</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="simType === 'A' && isSysManager"
        :disabled="isOneRow"
        @click="activate(false)"
      >停机</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="simType === 'A' && isSysManager"
        :disabled="isOneRow"
        @click="activate(true)"
      >复机</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="isSysManager"
        :disabled="isOneRow"
        @click="flowServStatus(true)"
      >停数据</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="isSysManager"
        :disabled="isOneRow"
        @click="flowServStatus(false)"
      >恢复数据</el-button>
      <el-button
        type="warning"
        size="mini"
        :disabled="isOneRow"
        v-if="isSysManager"
        @click="msgServStatus(true)"
      >停短信</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="isSysManager"
        :disabled="isOneRow"
        @click="msgServStatus(false)"
      >恢复短信</el-button>
      <el-button
        type="warning"
        v-if="simType === 'B' && isSysManager"
        size="mini"
        
        :disabled="isOneRow"
        @click="voiceServStatus(true)"
      >停语音</el-button>
      <el-button
        type="warning"
        v-if="simType === 'B' && isSysManager"
        size="mini"
        :disabled="isOneRow"
        @click="voiceServStatus(false)"
      >恢复语音</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="curUser.roleType !==6"
        @click="changeUser"
      >转让</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="curUser.roleType !==6"
        @click="changeUserWithSimNumOrRange"
      >转让(卡号或卡段)</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handlePrice"
      >用户增价</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="isSysManager"
        @click="handleComboChange"
      >更换套餐</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="isSysManager"
        @click="handleComboChangeInput"
      >更换套餐(卡号或卡段)</el-button>
      <!-- <el-button
        type="primary"
        size="mini"
        v-if="isSysManager && simType === 'A'"
        @click="handleActiveComboChangeInput"
      >更换激活套餐(卡号或卡段)</el-button> -->
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
        label="ICCID"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.iccid}}</template>
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
        label="用户月增价"
        min-width="120px"
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
        <template slot-scope="scope">{{ scope.row.monthFlow | DisplayFlow }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="叠加流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.monthOverlapFlow  | DisplayFlow }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="isSysManager"
        label="已用流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.monthUsedFlow  | DisplayFlow }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="isSysManager"
        label="虚拟倍数"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ `${scope.row.virtualMult}` }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="剩余流量(M)"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.monthShengyuFlow | DisplayFlow }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        v-if="simType === 'B'"
        label="余额(元)"
        min-width="100px"
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
        label="短信服务状态"
        min-width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.msgServStatus | serveStatus }}</template>
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
        width="190"
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
          <el-button
            type="text"
            v-if="isSysManager && isShowTransforBtn"
            @click="configLimtValueBySimId(scope.row)"
            size="small"
          >设置阀值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        v-if="data && data.pageSize"
        @size-change="handleSizeChange"
        :current-page="pageNum"
        @current-change="pageChange"
        :page-sizes="[50, 100, 200, 300, 400]"
        background
        layout="total,prev, pager, next, sizes"
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
      :title="'导入'+ (simType === 'B' ? '主叫卡': '被叫卡')"
      :visible.sync="importDialogForTransfor"
    >
      <com-import-transfor
        :type="simType"
        @close="closeTransfor"
      ></com-import-transfor>
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
    <el-dialog
      title="更换套餐(卡号或卡段)"
      :before-close="handleChangeComboClose"
      :visible.sync="comboInputDialog"
    >
      <combo-change-input
        ref="comboChangeInput"
        :type="simType"
        @close="closeComboInputChange"
      ></combo-change-input>
    </el-dialog>
    <el-dialog
      title="更换激活套餐(卡号或卡段)"
      :before-close="handleChangeActiveComboClose"
      :visible.sync="activeComboInputDialog"
    >
      <active-combo-change-input
        ref="activeComboChangeInput"
        :type="simType"
        @close="closeActiveComboInputChange"
      ></active-combo-change-input>
    </el-dialog>
    <el-dialog
      title="用户增价"
      :visible.sync="priceDialog"
    >
      <user-price @save="userAddPrice"></user-price>
    </el-dialog>
    <el-dialog
      title="转让"
      :before-close="handleCloseUserList"
      :visible.sync="userDialog"
    >
      <user-list 
      ref="changeUserRef"
      @save="saveUser"></user-list>
    </el-dialog>
    <el-dialog
      title="转让(卡号或卡段)"
      :before-close="handleClose"
      :visible.sync="userWithSimNumOrRangeDialog"
    >
      <user-list-input ref="ulistInput" @save="saveUserWithSimNumOrRange"></user-list-input>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api";
import searchBar from "@/components/SearchBar";
import comImport from "./com-import";
import comImportTransfor from "./com-import-transfor";
import comboChange from "./combo-change";
import comboChangeInput from "./combo-change-input";
import activeComboChangeInput from "./active-combo-change-input";
import userPrice from "./user-price";
import userList from "./user-list";
import userListInput from "./user-list-input";
import { getTableHeight, formatDisplayFlow } from "@/utils";
export default {
  data() {
    return {
      multipleSelection: [],
      pageNum: 1,
      curUser: {},
      simType: "A",
      mapSimTypeToName: { A: "被叫卡", B: "主叫卡" },
      pageSize: 50,
      isOneRow: false,
      importDialog: false,
      importDialogForTransfor: false,
      comboDialog: false,
      comboInputDialog: false,
      activeComboInputDialog: false,
      priceDialog: false,
      userDialog: false,
      userWithSimNumOrRangeDialog: false,
      isSysManager: false,
      isShowTransforBtn: false,
      tableHeight: null,
      list: [],
      data: null,
      searchParams: {},
      initSearchData: [
        {
          name: "simId",
          title: "sim卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "iccid",
          title: "ICCID",
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
            { value: "4", key: "停机" },
            { value: "21", key: "注销" },
            { value: "6", key: "可测试" },
            { value: "22", key: "欠费" }
          ],
          active: [1, 2, 3, 4, 5, 6, 7]
        }
      ],
      searchData: [
        {
          name: "simId",
          title: "sim卡号",
          type: "inputText",
          value: ""
        },
        {
          name: "iccid",
          title: "ICCID",
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
    userId() {
      return JSON.parse(localStorage.getItem('userInfo')).id;
    },
    isAdmin() {
      const roleType = JSON.parse(localStorage.getItem('userInfo')).roleType;
      return roleType == 1;
    },
    simIds() {
      const simIds = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        simIds.push(this.multipleSelection[i].simId);
      }
      return simIds;
    },
    oneLinkSimIds() {
      const simIds = {};
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let item = this.multipleSelection[i];
        if(!simIds[item.onelinkId]){
          simIds[item.onelinkId] = []
        }       
        simIds[item.onelinkId].push(item.simId)
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
    DisplayFlow(val) {
      const str = formatDisplayFlow(val ? val : 0);
      return str;
    },
    serveStatus(val) {
      const serveStatus = {
        1: "开",
        0: "关"
      };
      return serveStatus[val];
    }
  },
  components: {
    searchBar,
    comImport,
    comImportTransfor,
    comboChange,
    comboChangeInput,
    activeComboChangeInput,
    userPrice,
    userList,
    userListInput
  },

  methods: {
    checkAllMySim() {
      if (this.isAdmin) return true;
      const len = this.multipleSelection.filter(item => item.uid != this.userId).length;
      return !len;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist();
    },
    changeUser() {
      const isNonSelected = this.multipleSelection.length === 0;
      if (isNonSelected) {
        this.$message({
          message: '请先勾选要转让的卡',
          type: 'warning',
        })
        return;
      } else {
        if (!this.checkAllMySim()) {
          this.$message({
            message: '只能转让自己名下的卡',
            type: 'warning',
          })
          return;
        }
      }
      this.userDialog = true;
    },
    changeUserWithSimNumOrRange() {
      this.userWithSimNumOrRangeDialog = true;
    },
    getRoleType() {
      this.curUser = JSON.parse(localStorage.getItem('userInfo'));
      this.isSysManager =(this.curUser.roleLevel === 1 || this.curUser.roleLevel === 0);
      this.isShowTransforBtn = this.curUser.username === 'youlan';
    },
    saveUser(user) {
      this.batchUpdate({
        ...user
      })
    },
    saveUserWithSimNumOrRange(user) {
      this.axios({
        method: "post",
        data: {
          ...user
        },
        url: API.SIMLIST.SIM_BATCH_UPDATE_SIM_USER
      }).then((r) => {
        if (!r.success) {
          this.$message({
            message: r.msg,
            type: 'warning',
          })
        } else {
          this.$message({
            message: '批量更新成功',
            type: 'success'
          })
          this.getlist();
          this.handleClose();
          this.userWithSimNumOrRangeDialog = false;
        }
      });
    },
    handleCloseUserList() {
      this.$refs['changeUserRef'].reset();
      this.userDialog = false;
    },
    handleClose() {
      // this.$refs['ulistInput'].$refs['ruleForm'].resetFields();
      this.$refs['ulistInput'].reset();
      this.userWithSimNumOrRangeDialog = false;
    },
    handleChangeComboClose() {
      // this.$refs['comboChangeInput'].$refs['ruleForm'].resetFields();
      this.$refs['comboChangeInput'].reset();
      this.comboInputDialog = false;
    },
    handleChangeActiveComboClose() {
      this.$refs['activeComboChangeInput'].reset();
      this.activeComboInputDialog = false;
    },
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
      for(const key in this.oneLinkSimIds){
        if(this.oneLinkSimIds[key].length > 100) {
          this.$message({
          type: "warning",
          message: "一个集团一次更改的卡数不能超过100张，请确认数目！"
        });
        return;
        }
      }
      // 对应复机/停机后卡的状态
      const cardStatus = isActivated ? "2" : "4";
      this.confirm(`是否${isActivated ? "复机" : "停机"}选中的卡`, () => {
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
    checkFloeServ(status) {
      return this.multipleSelection.every(item => {
        return item.flowServStatus + '' === status;
      });
    },
    flowServStatus(status) {
      const handlingFlowServStatus = status? '1' : '0';
      const statusError = {
        1: "请确保所有卡的数据服务都是开启的",
        0: "请确保所有卡的数据服务都是关闭的",
        3: "请确保所有卡都是已激活状态"
      };
      if (!this.checkStatus('2')) {
        this.$message({
          type: "warning",
          message: statusError[3]
        });
        return;
      }
      if (!this.checkFloeServ(handlingFlowServStatus)) {
        this.$message({
          type: "warning",
          message: statusError[handlingFlowServStatus]
        });
        return;
      }
      const flowServStatus = status? 1 : 0;
      this.confirm(`是否${!status ? "恢复" : "关闭"}选中的卡`, () => {
        this.batchUpdate({
          flowServStatus
        });
      });
    },
    
    checkMsgServ(status) {
      return this.multipleSelection.every(item => {
        return item.msgServStatus + '' === status;
      });
    },
    msgServStatus(status) {
      const handlingMsgServStatus = status? '1' : '0';
      const statusError = {
        1: "请确保所有卡的语音服务都是开启的",
        0: "请确保所有卡的语音服务都是关闭的",
        3: "请确保所有卡都是已激活状态"
      };
      if (!this.checkStatus('2')) {
        this.$message({
          type: "warning",
          message: statusError[3]
        });
        return;
      }
      if (!this.checkMsgServ(handlingMsgServStatus)) {
        this.$message({
          type: "warning",
          message: statusError[handlingMsgServStatus]
        });
        return;
      }
      const msgServStatus = status? 1 : 0;
      this.confirm(`是否${!status ? "恢复" : "关闭"}选中的卡`, () => {
        this.batchUpdate({
          msgServStatus
        });
      });
    },
    checkVoiceServ(status) {
      return this.multipleSelection.every(item => {
        return item.voiceServStatus + '' === status;
      });
    },
    voiceServStatus(status) {
      const handlingVoiceServStatus = status? '1' : '0';
      const statusError = {
        1: "请确保所有卡的语音服务都是开启的",
        0: "请确保所有卡的语音服务都是关闭的",
        3: "请确保所有卡都是已激活状态"
      };
      if (!this.checkStatus('2')) {
        this.$message({
          type: "warning",
          message: statusError[3]
        });
        return;
      }
      if (!this.checkVoiceServ(handlingVoiceServStatus)) {
        this.$message({
          type: "warning",
          message: statusError[handlingVoiceServStatus]
        });
        return;
      }
      const voiceServStatus = status? 1 : 0;
      this.confirm(`是否批量${!status ? "恢复" : "关闭"}选中的卡`, () => {
        this.batchUpdate({
          voiceServStatus
        });
      });
    },
    userAddPrice(privateMoney) {
      this.batchUpdate({
        privateMoney
      })
    },
    closeDialog() {
      this.priceDialog = false;
      this.userDialog = false;
    },
    handlePrice() {
      const isNonSelected = this.multipleSelection.length === 0;
      if (isNonSelected) {
        this.$message({
          message: '请先勾选要增价的卡',
          type: 'warning',
        })
        return;
      }
      this.priceDialog = true;
    },
    batchUpdate(data) {
      this.axios({
        method: "post",
        data: {
          // oneLinkSimIds: this.oneLinkSimIds,
          simIds: this.simIds,
          ...data
        },
        url: API.SIMLIST.SIM_BATCH_UPDATE
      }).then((r) => {
        if (!r.success) {
          this.$message({
            message: r.msg,
            type: 'warning',
          })
        } else {
          this.$message({
            message: '批量更新成功',
            type: 'success'
          })
          this.getlist();
          this.closeDialog();
        }
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
          simId: item.simId,
          activeComboId: item.activeComboId
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
    configLimtValueBySimId(item) {
      this.axios({
        method: "get",
        params: {
          simId: item.simId
        },
        url: API.SIMLIST.SIM_CONFIG_LIMT_VALUE_BY_SIMID
      }).then(()=> {
        this.$message({
          message: "设置完成",
          type: "success"
        });
      });
    },
    configLimtValue() {
      this.$confirm('此操作一键设置所有卡的阀值，是否操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: "get",
          params: {
            simType: this.simType
          },
          url: API.SIMLIST.SIM_CONFIG_LIMT_VALUE
        }).then(() => {
        });
        
      }).catch(() => {
                
      });
    },
    migrationSyncUpdate() {
      this.axios({
        method: "get",
        params: {
          simType: this.simType
        },
        url: API.SIMLIST.SIM_MIGRAT_SYNC_UPDATE
      }).then(r => {
        if (r.success) {
          this.getlist();
          return;
        }
      });
    },
    iccidSyncUpdate() {
      this.axios({
        method: "get",
        params: {
          simType: this.simType
        },
        url: API.SIMLIST.SIM_ICCID_SYNC_UPDATE
      }).then(r => {
        if (r.success) {
          this.getlist();
          return;
        }
      });
    },
    handleExport() {
      this.axios({
        method: "post",
        data: {
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
    closeTransfor() {
      this.importDialogForTransfor = false;
      this.getlist();
    },
    closeComboChange() {
      this.comboDialog = false;
      this.reset();
      this.getlist();
    },
    closeComboInputChange() {
      this.comboInputDialog = false;
      this.getlist();
    },
    closeActiveComboInputChange() {
      this.activeComboInputDialog = false;
      this.getlist();
    },
    handleComboChange() {
      this.comboDialog = this.checkIsSelected();
    },
    handleComboChangeInput() {
      this.comboInputDialog = true;
    },
    handleActiveComboChangeInput() {
      this.activeComboInputDialog = true;
    },
    reset() {
      this.multipleSelection = [];
    },
    pageChange(page) {
      this.pageNum = page;
      this.getlist();
    },
    editSim(row) {
      this.$router.push(`/sim/editinfo/${this.simType}/${row.simId}`);
    },
    getlist(val) {
      let pageNum = this.pageNum;
      if (val) {
        this.searchParams = val;
        pageNum = 1;
      }
      this.axios({
        method: "post",
        loadEl: "#sim-list",
        data: {
          simType: this.simType,
          pageNum: pageNum,
          pageSize: this.pageSize,
          ...this.searchParams
        },
        url: API.SIMLIST.SIM_LIST
      }).then(r => {
        this.data = r.data;
        this.pageNum = r.data.pageNum;
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
      this.multipleSelection = val;
      if(val.length > 1) {
        this.isOneRow = true;
      }else {
        this.isOneRow = false;
      }
    },
    resetCondition() {
      this.searchParams = {};
      this.searchData = JSON.parse(JSON.stringify(this.initSearchData));
    }
  },
  mounted() {
    this.getRoleType();
    this.getlist();
  },
  watch: {
    type: function(newVal) {
      const isSame = this.simType === newVal;
      this.simType = newVal;
      if (!isSame) {
        this.pageNum = 1;
        this.resetCondition();
        this.getlist();
      }
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
