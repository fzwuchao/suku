<template>
  <div class="dashboard-container">
    <edit-bar></edit-bar>
    <div class="btn-list"></div>
    <div>
      <el-form
        label-width="130px"
        :model="role"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="角色"
          prop="roleType"
        >
          <el-select
          v-model="role.roleType"
          clearable
          placeholder="请选择"
          @change="changeRoleType"
          >
            <el-option
            v-for="rt in roleTypeList"
            :key="rt.CODE"
            :label="rt.DISPLAYNAME"
            :value="rt.CODE">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="角色英文名"
          prop="name"
        >
          <el-input v-model="role.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="角色中文名"
          prop="displayName"
        >
          <el-input v-model="role.displayName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="级别"
          prop="level"
        >
          <el-input v-model="role.level" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="权限"
          prop="permissions"
        >
          <el-tree
            :data="permissionsList"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="role.permissions"
            :props="defaultProps"
            ref="tree"
          >
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="submit"
          >保存</el-button>
          <el-button
            size="small"
            @click="cancel"
          >取消</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import EditBar from "../../components/EditBar";
import API from "@/api";
import { ROLE_TYPE_LIST } from '@/utils/utils';
export default {
  components: {
    EditBar
  },
  data() {
    return {
      roleTypeList: [],
      role: {
        id: null,
        name: "",
        displayName: "",
        permissions: [],
        level: '',
        roleType: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入角色英文名" },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const reg = /^[0-9a-zA-Z]+$/;
              if (!reg.test(value)) {
                callback("只能包括字母和数字");
              } else {
                callback();
              }
            }
          }
        ],
        level: [
          {required: true, message: "请输入角色级别"},
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const reg = /^[0-9]+$/
              if (!reg.test(value)) {
                callback("请输入整数");
              } else {
                callback();
              }
            }
          }
        ],
        displayName: [{ required: true, message: "请输入角色中文名" }],
        permissions: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              this.role.permissions = this.$refs.tree.getCheckedKeys();
              if (this.role.permissions.length === 0) {
                callback("请勾选权限");
              } else {
                callback();
              }
            }
          }
        ],
        roleType: [
          { required: true, message: "请选择角色类型" }
        ]
      },
      permissionsList: [],
      defaultProps: {
        children: "subMenuList",
        label: "menuName"
      }
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) return;
        const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
        const data = {
          ...this.role,
          permissions: this.role.permissions.concat(halfCheckedKeys),
        };
        this.axios({
          method: "post",
          data,
          url: API.PERMISSION.PERMISSION_SAVE
        }).then(r => {
          if (r.success) {
            this.$router.push("/system/roleList");
          } else {
            this.$message({
              message: r.msg,
              type: 'error'
            })
          }
        });
      });
    },
    cancel() {
      this.$refs["ruleForm"].resetFields();
      this.$router.push("/system/roleList");
    },
    getRoleType(code) {
      const [ roleType ] = this.roleTypeList.filter(roleType => roleType.CODE === code);
      return roleType;
    },
    changeRoleType(val) {
      const roleType = this.getRoleType(val);
      this.role.name = roleType ? roleType.NAME : null;
      this.role.displayName = roleType ? roleType.DISPLAYNAME : null;
      this.role.level = roleType ? roleType.LEVEL : null;
    },
    getRoleTypeList() {
      ROLE_TYPE_LIST.then(val => this.roleTypeList = val);
    },
    getPermission() {
      this.axios({
        method: "get",
        url: API.PERMISSION.GET_ALL_PERMISSION
      }).then(r => {
        let data = r.data || [];
        this.permissionsList = data;
      });
    },
    getRolePermission() {
      this.axios({
        method: "get",
        params: {
          roleId: this.role.id,
        },
        url: API.PERMISSION.GET_PERMISSION_BY_ROLE_ID
      }).then(r => {
        let data = r.data || {};
        this.role.permissions = data.checkedAndHalfKeys.checkedKeys;
      });
    },
    initRole() {
      // 编辑时，回显相关信息
      if (this.$route.params.id) {
        this.role.id = this.$route.params.id;
        const { name, displayName, level, roleType } = this.$route.query;
        this.role.name = name;
        this.role.displayName = displayName;
        this.role.level = level;
        this.role.roleType = roleType;
        // this.role.permissions = this.checkedAndHalfKeys.checkedKeys;
        this.getRolePermission();
      }
    }
  },
  mounted() {
    this.getPermission();
    this.initRole();
    this.getRoleTypeList();
  }
};
</script>
<style lang="scss">
.dashboard-container {
  padding: 60px;
  font-weight: 400;
}
</style>
