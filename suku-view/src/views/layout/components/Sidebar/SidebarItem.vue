
<template>
  <div class="menu-wrapper">
    <template>
      <div v-for="(item,index) in routes" :key="index">
        <a
          @dragstart="dragstart"
          @click="goto(item.redirect? item.redirect:item.path)"
          v-if="!item.hidden&&item.children&&!item.showChild"
          :to="item.redirect? item.redirect:item.path"
          :key="item.name"
        >
          <el-menu-item
            :index="item.children[0].meta && item.children[0].meta.activeName"
            class="submenu-title-noDropdown"
          >
            <svg-icon
              v-if="item.children[0].meta&&item.children[0].meta.icon"
              :name="item.children[0].meta.icon"
            />
            <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.meta.title}}</span>
          </el-menu-item>
        </a>

        <el-submenu
          v-if="!item.hidden&&item.children&&item.showChild"
          :index="(item.meta && item.meta.activeName)||item.name||item.path"
          :key="item.name"
        >
          <template slot="title">
            <svg-icon v-if="item.meta&&item.meta.icon" :name="item.meta.icon" />
            <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
          </template>
          <template v-for="child in item.children">
            <sidebar-item
              class="nest-menu"
              v-if="!child.hidden&&child.children&&child.children.length>0"
              :routes="[child]"
              :key="child.name"
            ></sidebar-item>

            <a
              @dragstart="dragstart"
              @click="goto(child.path)"
              v-if="!child.hidden&&(!child.children||(child.children && child.children.length==0))"
              :to="child.path"
              :key="child.name"
            >
              <el-menu-item :index="(child.meta&&child.meta.activeName)||child.name||child.path">
                <svg-icon v-if="child.meta&&child.meta.icon" :name="child.meta.icon" />
                <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
              </el-menu-item>
            </a>
          </template>
        </el-submenu>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array
    }
  },
  methods: {
    dragstart() {
      return;
    },
    goto(path) {
      this.$router.push(path);
    }
  }
};
</script>
<style>
.el-submenu__title a + i {
  display: none;
}
</style>
