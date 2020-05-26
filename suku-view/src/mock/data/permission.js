export default {
    "code": 200,
    "msg": "success",
    "data": [{
        "id": 7,
        "menuName": "系统管理",
        "menuUrl": "/system",
        "menuDesc": "",
        "menuStatus": null,
        "menuOrder": 8,
        "parentId": 0,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮,3:功能
        "status": 0,
        "subMenuList": [{
            "id": 30,
            "menuName": "用户管理",
            "menuUrl": "/system/userList",
            "menuView": "layout/secondLayout",
            "activeName": "system/userList",
            "menuDesc": "",
            "menuType": 1, // 1:菜单，2:按钮
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 7,
            "status": 0,
            "subMenuList": [{
                "id": 9,
                "menuName": "用户列表",
                "menuUrl": "/system/userList",
                "menuView": "system/userList",
                "menuDesc": "",
                "activeName": "system/userList",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }, {
                "id": 9,
                "menuName": "新增用户",
                "menuUrl": "/system/adduser",
                "menuView": "system/editUser",
                "menuDesc": "",
                "activeName": "system/userList",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }, {
                "id": 10,
                "menuName": "编辑用户",
                "menuUrl": "/system/edituser/:id",
                "menuView": "system/editUser",
                "menuDesc": "",
                "activeName": "system/userList",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 8,
            "menuName": "角色管理",
            "menuUrl": "/system/roleList",
            "menuView": "system/roleList",
            "activeName": "system/roleList",
            "menuDesc": "",
            "name": "system/roleList",
            "menuType": 1, // 1:菜单，2:按钮
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 7,
            "status": 0,
            "subMenuList": []
        }, {
            "id": 30,
            "menuName": "onlink平台配置",
            "menuUrl": "/system/userList",
            "menuView": "layout/secondLayout",
            "activeName": "system/userList",
            "menuDesc": "",
            "menuType": 1, // 1:菜单，2:按钮
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 7,
            "status": 0,
            "subMenuList": [{
                "id": 9,
                "menuName": "列表",
                "menuUrl": "/system/onelinklist",
                "menuView": "system/onelinkList",
                "menuDesc": "",
                "activeName": "system/onelinklist",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }, {
                "id": 9,
                "menuName": "新增onelink平台",
                "menuUrl": "/system/addonelink",
                "menuView": "system/editOnelink",
                "menuDesc": "",
                "activeName": "system/onelinklist",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }, {
                "id": 10,
                "menuName": "编辑用户",
                "menuUrl": "/system/editonelink/:id",
                "menuView": "system/editOnelink",
                "menuDesc": "",
                "activeName": "system/onelinklist",
                "menuStatus": null,
                "menuOrder": 2,
                "menuType": 2, // 1:菜单，2:按钮
                "parentId": 7,
                "status": 0,
                "subMenuList": []
            }]
        }]
    }, {
        "id": 5,
        "menuName": "SIM卡管理",
        "menuUrl": "/sim",
        "menuDesc": "",
        "menuStatus": null,
        "menuOrder": 11,
        "parentId": 0,
        "menuIcon": 'table',
        "status": 0,
        "menuType": 1, // 1:菜单，2:按钮
        "subMenuList": [{
            "id": 6,
            "menuName": "被叫卡(A类)",
            "menuUrl": "/sim/list",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "activeName": "sim/simlayout/A",
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/sim/list/A",
                "menuView": "sim/list",
                "activeName": "sim/simlayout/A",
                "menuDesc": "",
                "props": '{"type":"A"}',
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/sim/editinfo/A/:id',
                "menuView": "sim/editinfo",
                "menuName": '编辑SIM卡',
                "activeName": "sim/simlayout/A",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "主叫卡(B类)",
            "menuUrl": "/sim/list",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "sim/simlayout/B",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/sim/list/B",
                "menuView": "sim/list",
                "activeName": "sim/simlayout/B",
                "menuDesc": "",
                "props": '{"type":"B"}',
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/sim/editinfo/B/:id',
                "menuView": "sim/editinfo",
                "menuName": '新增SIM卡',
                "activeName": "sim/simlayout/B",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "白名单设置记录",
            "menuUrl": "/sim/list",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "activeName": "",
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/sim/writeList",
                "menuView": "sim/writeList",
                "activeName": "sim/writeList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }]
        }]
    }, {
        "id": 7,
        "menuName": "套餐管理",
        "menuUrl": "/simcombo",
        "menuDesc": "",
        "menuStatus": null,
        "menuOrder": 8,
        "parentId": 0,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮
        "status": 0,
        "subMenuList": [{
            "id": 6,
            "menuName": "激活套餐",
            "menuUrl": "/simcombo/list",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/list",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/list",
                "menuView": "simcombo/list",
                "activeName": "simcombo/list",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editinfo/:id',
                "menuView": "simcombo/editinfo",
                "menuName": '编辑套餐',
                "activeName": "simcombo/list",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "激活套餐包",
            "menuUrl": "/simcombo/comboPackList",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/comboPackList",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/comboPackList",
                "menuView": "simcombo/comboPackList",
                "activeName": "simcombo/comboPackList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editPack/:id',
                "menuView": "simcombo/editPack",
                "menuName": '编辑套餐包',
                "activeName": "simcombo/comboPackList",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "叠加套餐",
            "menuUrl": "/simcombo/increaseList",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/increaseList",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/increaseList",
                "menuView": "simcombo/increaseList",
                "activeName": "simcombo/increaseList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editIncrease/:id',
                "menuView": "simcombo/editIncrease",
                "menuName": '编辑套餐',
                "activeName": "simcombo/increaseList",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "叠加套餐包",
            "menuUrl": "/simcombo/increasePackList",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/increasePackList",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/increasePackList",
                "menuView": "simcombo/increasePackList",
                "activeName": "simcombo/increasePackList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editIncreasePack/:id',
                "menuView": "simcombo/editIncreasePack",
                "menuName": '编辑套餐包',
                "activeName": "simcombo/increasePackList",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "特惠套餐",
            "menuUrl": "/simcombo/discountsList",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/discountsList",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/discountsList",
                "menuView": "simcombo/discountsList",
                "activeName": "simcombo/discountsList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editDiscounts/:id',
                "menuView": "simcombo/editDiscounts",
                "menuName": '编辑套餐',
                "activeName": "simcombo/discountsList",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }, {
            "id": 6,
            "menuName": "特惠套餐包",
            "menuUrl": "/simcombo/discountsPackList",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "simcombo/discountsPackList",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/simcombo/discountsPackList",
                "menuView": "simcombo/discountsPackList",
                "activeName": "simcombo/discountsPackList",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }, {
                "id": 24,
                "menuUrl": '/simcombo/editDiscountsPack/:id',
                "menuView": "simcombo/editDiscountsPack",
                "menuName": '编辑套餐包',
                "activeName": "simcombo/discountsPackList",
                "menuType": 2, // 1:菜单，2:按钮
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "status": 0,
                "subMenuList": []
            }]
        }]
    }, {
        "id": 7,
        "menuName": "订单管理",
        "menuUrl": "/order",
        "menuDesc": "",
        "menuStatus": null,
        "menuOrder": 8,
        "parentId": 0,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮
        "status": 0,
        "subMenuList": [{
            "id": 6,
            "menuName": "激活订单",
            "menuUrl": "/order/list",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "order/list",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/order/list",
                "menuView": "order/list",
                "activeName": "order/list",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }]
        }, {
            "id": 6,
            "menuName": "叠加订单",
            "menuUrl": "/order/increase",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "order/increase",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/order/increase",
                "menuView": "order/increase",
                "activeName": "order/increase",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }]
        }, {
            "id": 6,
            "menuName": "特惠订单",
            "menuUrl": "/order/discounts",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "order/discounts",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/order/discounts",
                "menuView": "order/discounts",
                "activeName": "order/discounts",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }]
        }, {
            "id": 6,
            "menuName": "续费订单",
            "menuUrl": "/order/renew",
            "menuView": "layout/secondLayout",
            "menuDesc": "",
            "activeName": "order/renew",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            "subMenuList": [{
                "id": 6,
                "menuName": "查询",
                "menuUrl": "/order/renew",
                "menuView": "order/renew",
                "activeName": "order/renew",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
            }]
        }]
    }, {
        "id": 6,
        "menuName": "提现管理",
        "menuUrl": "/withdrawal/list",
        "menuDesc": "",
        "activeName": "withdrawal/list",
        "menuStatus": null,
        "menuOrder": 1,
        "parentId": 5,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮
        "status": 0,
        "subMenuList": [{
            "id": 6,
            "menuName": "提现记录",
            "menuUrl": "/withdrawal/list",
            "menuView": "layout/secondLayout",
            "activeName": "withdrawal/list",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            subMenuList: [{
                "id": 6,
                "menuName": "列表",
                "menuUrl": "/withdrawal/list",
                "menuView": "withdrawal/list",
                "activeName": "withdrawal/list",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
                subMenuList: []
            }]
        }, {
            "id": 6,
            "menuName": "提现账户",
            "menuUrl": "/withdrawal/account",
            "menuView": "layout/secondLayout",
            "activeName": "withdrawal/account",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            subMenuList: [{
                "id": 6,
                "menuName": "列表",
                "menuUrl": "/withdrawal/account",
                "menuView": "withdrawal/account",
                "activeName": "withdrawal/account",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
                subMenuList: []
            }, {
                "id": 6,
                "menuName": "编辑账户",
                "menuUrl": "/withdrawal/editAccount/:id",
                "menuView": "withdrawal/editAccount",
                "activeName": "withdrawal/account",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
                subMenuList: []
            }]
        }]
    }, {
        "id": 6,
        "menuName": "短信管理",
        "menuUrl": "/message/list",
        "menuDesc": "",
        "activeName": "message/list",
        "menuStatus": null,
        "menuOrder": 1,
        "parentId": 5,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮
        "status": 0,
        "subMenuList": [{
            "id": 6,
            "menuName": "短信发送记录",
            "menuUrl": "/message/list",
            "menuView": "message/list",
            "activeName": "message/list",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            subMenuList: []
        }, {
            "id": 6,
            "menuName": "上行短信记录",
            "menuUrl": "/message/above",
            "menuView": "message/above",
            "activeName": "message/above",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            subMenuList: []
        }]
    }, {
        "id": 6,
        "menuName": "出入库管理",
        "menuUrl": "/warehouse/list",
        "menuDesc": "",
        "activeName": "warehouse/list",
        "menuStatus": null,
        "menuOrder": 1,
        "parentId": 5,
        "menuIcon": 'table',
        "menuType": 1, // 1:菜单，2:按钮
        "status": 0,
        "subMenuList": [{
            "id": 6,
            "menuName": "SIM卡流水",
            "menuUrl": "/warehouse/list",
            "menuView": "layout/secondLayout",
            "activeName": "warehouse/list",
            "menuDesc": "",
            "menuStatus": null,
            "menuOrder": 1,
            "parentId": 5,
            "menuType": 1, // 1:菜单，2:按钮
            "status": 0,
            subMenuList: [{
                "id": 6,
                "menuName": "列表",
                "menuUrl": "/warehouse/list",
                "menuView": "warehouse/list",
                "activeName": "warehouse/list",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
                subMenuList: []
            }, {
                "id": 6,
                "menuName": "编辑SIM卡流水",
                "menuUrl": "/warehouse/editInfo/:id",
                "menuView": "warehouse/editInfo",
                "activeName": "warehouse/list",
                "menuDesc": "",
                "menuStatus": null,
                "menuOrder": 1,
                "parentId": 5,
                "menuType": 1, // 1:菜单，2:按钮
                "status": 0,
                subMenuList: []
            }]
        }]
    }]
}