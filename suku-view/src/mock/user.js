import userListData from './data/users'
import RoleList from './data/role'

export default {
    getUserList: () => {
        return userListData
    },
    getRoleList: () => {
        return RoleList
    }
}