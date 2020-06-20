'use strict';
const moment = require('moment');
// 权限表对象
module.exports = app => {
  const { STRING, DATE, BIGINT, TINYINT, VIRTUAL } = app.Sequelize;

  const Permission = app.model.define('permission', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    menuName: {
      type: STRING(50),
      field: 'menu_name',
      comment: '名称',
    },
    menuUrl: {
      type: STRING(50),
      field: 'menu_url',
      comment: 'url，如果是菜单就是菜单的地址，如果是按钮也是按钮的route，如果是接口，则是接口的api',
    },
    menuView: {
      type: STRING(50),
      field: 'menu_view',
      comment: 'router对应的页面地址',
    },
    menuDesc: {
      type: STRING(100),
      field: 'menu_desc',
      comment: '描述',
    },
    activeName: {
      type: STRING(50),
      field: 'active_name',
      comment: '当前route展现是左侧菜单选中的active_name',
    },
    menuStatus: {
      type: STRING(10),
      field: 'menu_status',
      comment: '',
    },
    parentId: {
      type: BIGINT(20),
      field: 'parent_id',
      comment: '父级菜单id',
    },
    status: {
      type: STRING(10),
      comment: '',
    },
    menuOrder: {
      type: TINYINT(1),
      field: 'menu_order',
      defaultValue: 0,
      comment: '菜单序号',
    },
    menuType: {
      type: TINYINT(1),
      field: 'menu_type',
      comment: '1:菜单，2:按钮，3:接口',
    },
    props: {
      type: STRING(50),
      comment: '',
    },
    menuIcon: {
      type: STRING(30),
      field: 'menu_icon',
      comment: '',
    },
    subMenuList: {
      type: VIRTUAL, // 这种类型的字段，不存在于表中，只在model中
    },
    createdAt: {
      type: DATE,
      field: 'created_at',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'updated_at',
      comment: '更新时间',
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Permission;
};
