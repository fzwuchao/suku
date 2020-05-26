<template>
  <div class="edit-bar">
    <breadcrumb></breadcrumb>
    <el-button type="primary" @click="edit" v-if="showEdit">编辑</el-button>
    <el-button type="primary" v-if="showEdit" @click="back">返回</el-button>
  </div>
</template>

<script>
import Breadcrumb from "../Breadcrumb";
export default {
  components: {
    Breadcrumb
  },
  props: {
    showEdit: {
      type: Boolean,
      default: false
    },
    editPath: {
      type: String,
      default: ""
    },
    backPath: {
      type: String,
      default: ""
    }
  },
  methods: {
    edit() {
      this.$router.push({
        path: this.editPath
      });
    },
    back() {
      this.$router.push({
        path: this.backPath
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-bar {
  text-align: right;
  background: #fff;
  height: 60px;
  line-height: 60px;
  padding: 15px 60px;
  margin-bottom: 50px;
}
</style>
