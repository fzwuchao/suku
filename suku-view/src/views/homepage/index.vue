<template>
  <div class="dashboard-container">
    <div>欢迎使用数据分析平台系统！</div>
  </div>
</template>

<script>

export default {
  name: 'dashboard',
  components: {},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  mounted() {
  },
  computed: {
  },
  created() {
  }
}
</script>
<style lang="scss">
  .dashboard-container{
    padding:60px;
    font-weight:400;
  }
</style>
