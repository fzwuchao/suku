<template>
  <div class="searchBar">
    <div class="top">
      <el-button type="primary" @click="empty">清空</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="(item,index) in searchData"
        :title="item.title"
        :name="item.name"
        :key="'collapse_' + index"
      >
        <ul v-if="item.type === 'select'" class="el-menu-vertical-demo selectOption">
          <li
            :class="{'active': option.value === item.active}"
            v-for="(option, idx) in item.values"
            @click="handleSearch(index, option)"
            :key="idx"
          >
            <span slot="title">{{option.key}}</span>
            <i class="el-icon-check"></i>
          </li>
        </ul>
        <el-checkbox-group
          v-model="item.active"
          v-if="item.type === 'multiple'"
          @change="handleSearch(index, {'value': item.active})"
        >
          <el-checkbox
            v-for="option in item.values"
            :label="option.value"
            :key="option.key"
          >{{option.key}}</el-checkbox>
        </el-checkbox-group>
        <div v-if="item.type === 'inputRange'">
          <el-input
            value="number"
            v-model.trim="item.values[0]"
            size="small"
            class="inputRange"
            @input.native="handleSearch(index, {'value': item.values},true)"
            :maxlength="15"
          ></el-input>
          <span>-</span>
          <el-input
            value="number"
            v-model.trim="item.values[1]"
            size="small"
            class="inputRange"
            @input.native="handleSearch(index, {'value': item.values},true)"
            :maxlength="15"
          ></el-input>
          <el-button size="small" @click="handleSearch(index, {'value': item.values})">确定</el-button>
        </div>
        <div v-if="item.type === 'inputMoneyRange'">
          <el-input
            value="number"
            v-model.trim="item.values[0]"
            size="small"
            class="inputRange"
            @input.native="handleSearch(index, {'value': item.values},true)"
            :maxlength="15"
          ></el-input>
          <span>-</span>
          <el-input
            value="number"
            v-model.trim="item.values[1]"
            size="small"
            class="inputRange"
            @input.native="handleSearch(index, {'value': item.values},true)"
            :maxlength="15"
          ></el-input>
          <el-button size="small" @click="handleSearch(index, {'value': item.values})">确定</el-button>
        </div>
        <div v-if="item.type === 'dateaRange'">
          <el-date-picker
            :editable="false"
            @change="handleSearch(index, {'value': item.values})"
            v-model="item.values"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div v-if="item.type === 'inputText'">
          <el-input
            v-model.trim="item.value"
            size="small"
            :maxlength="20"
            @input.native="handleSearch(index, {'value': item.value},true)"
            class="inputText"
          ></el-input>
          <el-button size="small" @click="handleSearch(index, {'value': item.value})">确定</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: {
    searchData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeNames: [],
      searchParam: {},
      value6: ""
    };
  },
  methods: {
    handleChange() {},
    empty() {
      this.activeNames = [];
      this.searchParam = {};
      for (var i = 0; i < this.searchData.length; i++) {
        var item = this.searchData[i];
        if (item.type === "select") {
          item.active = "";
        } else if (item.type === "inputText") {
          item.value = "";
        } else if (item.type === "multiple") {
          item.active = [];
          for (let j = 0; j < item.values.length; j++) {
            item.active.push(item.values[j].value);
          }
          this.searchParam[item.name] = item.active;
        } else {
          this.searchData[i].values = [];
        }
      }
      this.$emit("handleGetList", this.searchParam);
    },
    handleSearch(index, option, flag) {
      var item = this.searchData[index];
      let param = {};
      var numReg = /^\d+$/;
      var moneyReg = /(^[1-9](\d+)?(\.\d+)?$)|(^(0){1}$)|(^\d\.\d+?$)/;
      if (item.type === "select") {
        this.searchData[index].active = option.value;
      } else if (item.type === "inputRange") {
        if (option.value[0] !== 0 && !option.value[0]) {
          option.value[0] = null;
        } else if (option.value[1] !== 0 && !option.value[1]) {
          option.value[1] = null;
        } else if (
          !numReg.test(option.value[0]) ||
          !numReg.test(option.value[1])
        ) {
          return;
        }
        option.value[0] =
          option.value[0] === 0
            ? 0
            : option.value[0]
            ? parseInt(option.value[0], 10)
            : null;
        option.value[1] =
          option.value[1] === 0
            ? 0
            : option.value[1]
            ? parseInt(option.value[1], 10)
            : null;
      } else if (item.type === "inputMoneyRange") {
        if (option.value[0] !== 0 && !option.value[0]) {
          option.value[0] = null;
        } else if (option.value[1] !== 0 && !option.value[1]) {
          option.value[1] = null;
        } else if (
          !moneyReg.test(option.value[0]) ||
          !moneyReg.test(option.value[1])
        ) {
          return;
        }
        option.value[0] =
          option.value[0] === 0
            ? 0
            : option.value[0]
            ? parseFloat(option.value[0], 10)
            : null;
        option.value[1] =
          option.value[1] === 0
            ? 0
            : option.value[1]
            ? parseFloat(option.value[1], 10)
            : null;
      } else if (item.type === "dateaRange") {
        if (!option.value || option.value.length === 0) {
          return;
        }
      }
      param[item.name] = option.value;
      this.searchParam = Object.assign(this.searchParam, param);
      if (!flag) {
        this.$emit("handleGetList", this.searchParam);
      }
    }
  },
  mounted() {
    document.querySelector(".searchBar").parentNode.style.paddingRight =
      "290px";
  },
  created() {
    // this.activeNames = this.searchData[0].name;
  }
};
</script>
<style lang="scss">
.searchBar {
  position: absolute;
  right: 20px;
  top: 144px;
  width: 250px;
  border: 1px solid #EBEEF5;
  border-radius: 6px;
  background: #fff;
  max-height: 520px;
  overflow-y: auto;
  .top {
    text-align: center;
    padding: 20px 0;
    button {
      // background:#f4bc15;
      color: #fff;
      width: 120px;
      height: 40px;
    }
  }
  .el-collapse-item {
    padding-left: 10px;
    .el-collapse-item__arrow {
      float: left;
    }
    .selectOption {
      padding: 0;
      list-style: none;
      margin: 0;
      li {
        line-height: 28px;
        height: 28px;
        cursor: pointer;
        text-indent: 20px;
        i {
          display: none;
          color: #409eff;
        }
        &:hover {
          background: #e6effb;
        }
        &.active {
          i {
            display: inline-block;
          }
        }
      }
    }
    .inputRange {
      width: auto;
      input {
        width: 46px;
        padding: 0 5px;
      }
    }
    .el-button--small {
      padding: 9px;
    }
    .el-date-editor {
      width: 226px;
      padding: 3px;
      i {
        display: none;
      }
      input {
        width: 45%;
        // font-size:10px!important;
      }
    }
    .inputText {
      width: 70%;
    }
    .el-checkbox-group {
      .el-checkbox {
        display: block;
        padding: 5px;
      }
      .el-checkbox + .el-checkbox {
        margin: 0;
      }
    }
  }
}
</style>
