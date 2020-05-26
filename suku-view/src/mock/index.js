import Mock from 'mockjs'
import loginAPI from './login'
import userAPI from './user'
import simAPI from './simList'
import simComboAPI from './simCombo'
import API from '@/api'
import {
    formatUrl
} from '../utils/utils'
// Mock.setup({
//   timeout: '350-600'
// })
// 登录相关

Mock.mock(formatUrl(API.USERS.LOGIN), 'post', loginAPI.loginByUsername)
Mock.mock(formatUrl(API.USERS.USER_PERMISSION), 'get', loginAPI.getUserMenuList)
Mock.mock(formatUrl(API.USERS.USER_LIST), 'get', userAPI.getUserList)
Mock.mock(formatUrl(API.USERS.ROLE_LIST), 'get', userAPI.getRoleList)
Mock.mock(formatUrl(API.SIMLIST.SIM_LIST), 'get', simAPI.getSimList)
Mock.mock(formatUrl(API.SIMLIST.WRITE_LIST), 'get', simAPI.getWriteList)
Mock.mock(formatUrl(API.SIMCOMBO.SIM_COMBO_LIST), 'get', simComboAPI.getSimComboList)
Mock.mock(formatUrl(API.SIMCOMBO.COMBO_PACK_LIST), 'get', simComboAPI.getComboPackList)
export default Mock