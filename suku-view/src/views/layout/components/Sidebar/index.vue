<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      unique-opened
      :default-active="$route.meta && $route.meta.activeName"
      :collapse="isCollapse"
      background-color="#20222A"
      text-color="#fff"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    routes() {
      // console.log(this.$router.options.routes);
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
