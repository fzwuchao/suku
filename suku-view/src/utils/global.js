const URL = {
    V1: {
        USER_KEY: "/v1/user/"
    },
    SHANYUAN: {
        DEMAND_LIST: "/shanyuan/admin/demand/list",
        DEMAND_VIEW: "/shanyuan/admin/demand/view",
        DEMAND_CREATE: "/shanyuan/admin/demand/create",
        DEMAND_DELETE: "/shanyuan/admin/demand/delete",
        DEMAND_DEMAND_CHECK: "/shanyuan/admin/demand/check",
        DEMAND_GET_GOODLIST: "/shanyuan/demand/getGoodList",
        DEMAND_DEMANDLIST: "/shanyuan/admin/demand/list",
        DEMAND_GET_DEMNADINFO: "/shanyuan/admin/demand/view",
        DONATION_CHECK: "/shanyuan/admin/donation/publish",
        DONATION_DONATIONLIST: "/shanyuan/admin/donation/list",
        DONATION_GET_DONATIONINFO: "/shanyuan/admin/donation/view",
        UPLOAD_IMAGE: "/shanyuan/upload/image",
        POST_LOGIN: "/shanyuan/login"
    }
}
const WHITELIST = ['/login', '/404'] // 页面不需要登录验证的路由白名单
const LOGOUT_URL = `${process.env.SSO_SERVER}/logout?service=http://${window.location.host}${process.env.ROOTP}`
const HOST = 'http://pangu.adtime.com/img/handle/'
module.exports = {
    URL,
    WHITELIST,
    LOGOUT_URL,
    HOST
}