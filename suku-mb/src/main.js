import "@/svg";
import "@/scss/base.scss";
import "@/scss/index.scss";
import SvgIcon from "@/components/SvgIcon";

import "amfe-flexible";

import Vue from "vue";

import {
    Button,
    Tab,
    Tabs,
    Dialog,
    NavBar,
    Pagination,
    Field,
    Uploader,
    ActionSheet,
    Popup,
    Icon,
    RadioGroup,
    Radio,
    Cell,
    CellGroup,
    ImagePreview,
    Area,
    Step,
    Steps,
    NoticeBar,
    Grid,
    GridItem,
    List
} from "vant";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { getOpenId } from './utils';

import axios from './utils/axiosPlugin';
let vantComponents = [
    Button,
    Tab,
    Tabs,
    Dialog,
    NavBar,
    Pagination,
    Field,
    Uploader,
    ActionSheet,
    Popup,
    Icon,
    RadioGroup,
    Radio,
    Cell,
    CellGroup,
    ImagePreview,
    Area,
    Step,
    Steps,
    NoticeBar,
    Grid, GridItem,
    List
]
vantComponents.forEach(comp => {
    Vue.use(comp)
})
Vue.component("SvgIcon", SvgIcon);
Vue.use(axios);
Vue.config.productionTip = false;
Vue.config.devtools = true;
router.beforeEach((to, from, next) => {
  if (to.query.preview === 'yes' || to.path === '/index/wechat/test-index') {
    next();
  } else {
    getOpenId().then(() => {
      next();
    });
  }
});
new Vue({
    name: "APP",
    router,
    store,
    render: h => h(App)
}).$mount("#app");