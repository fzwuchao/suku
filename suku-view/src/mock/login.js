import {
    param2Obj
} from '@/utils/utils'
import menuMap from './data/permission'
const userMap = {
        admin: {
            role: ['admin'],
            token: 'admin',
            introduction: '我是超级管理员',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'admin'
        },
        editor: {
            role: ['editor'],
            token: 'editor',
            introduction: '我是编辑',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'editor'
        }
    }
    /* let msg = {
        code: 200,
        massage: 'success'
    } */
export default {
    loginByUsername: config => {
        let username = 'admin'
        if (config.body) {
            username = param2Obj(config.body).username
        }

        return {
            code: 200,
            data: userMap[username]
        }
    },
    getUserInfo: config => {
        const {
            token
        } = param2Obj(config.url)
        if (userMap[token]) {
            return userMap[token]
        } else {
            return false
        }
    },
    getUserMenuList: () => {
        // const { role } = param2Obj(config.url)
        return {
            code: 200,
            data: menuMap
        }
    },
    logout: () => 'success'
}