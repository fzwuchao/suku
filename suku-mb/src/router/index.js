import Vue from "vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Index",
    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/index.vue")
}, {
    path: "/recharge/:simId",
    name: "Recharge",
    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/recharge.vue")
}, {
    path: "/message/:simId",
    name: "Message",
    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/message.vue")
}, {
    path: "/contact/:simId",
    name: "Contact",
    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/contact.vue")
}, {
    path: "/pay/:comboId/:packId",
    name: "Pay",
    component: () =>
        import ( /* webpackChunkName: "about" */ "../views/pay.vue")
}, {
  path: "/index/wechat/test-index",
  name: "TestIndex",
  component: () =>
      import ( /* webpackChunkName: "about" */ "../views/testIndex.vue")
}];

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'history',
    routes
});

export default router;