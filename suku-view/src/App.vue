<template>
  <div id="app">
    <router-view @logSuccess="logSuccess"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    logSuccess() {
      this.$notify({
        title: "成功",
        message: "登录成功",
        type: "success",
        duration: 2000
      });
    }
  }
};
</script>
<style lang="scss">
</style>

