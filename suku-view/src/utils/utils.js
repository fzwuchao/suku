/* eslint-disable no-const-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-control-regex */
import API from "@/api";

import mem from 'mem';

import axios from './request';



export const getByteLen = function(val, maxLen) {
    var len = 0

    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2
        } else {
            len += 1
        }
        // console.log(len); console.log(maxLen);
        if (maxLen && len === maxLen) {
            return i
        } else if (maxLen && len > maxLen) {
            return i - 1
        }
    }
    return len
}

export const formatterText = function(text, num) {
    var len = 0
    var r = ''
    for (var i = 0; i < text.length; i++) {
        var a = text.charAt(i)
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2
        } else {
            len += 1
        }
        if (len <= num) {
            r += a
        } else {
            r += '...'
            break
        }
    }
    return r
}

export function cloneObj(oldObj) { // 复制对象方法
    if (typeof(oldObj) !== 'object')
        return oldObj
    if (oldObj == null)
        return oldObj
    var newObj = {}
    for (var i in oldObj) {
        newObj[i] = cloneObj(oldObj[i])
    }
    return newObj
}
export function extendObj() { // 扩展对象
    var args = arguments
    if (args.length < 2)
        return
    var temp = cloneObj(args[0]) // 调用复制对象方法
    for (var n = 1; n < args.length; n++) {
        for (var i in args[n]) {
            temp[i] = args[n][i]
        }
    }
    return temp
}
export function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window
        .location
        .search
        .substr(1)
        .match(reg)
    if (r != null) {
        return unescape(r[2])
    }
    return null
}
export function merge(target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        let source = arguments[i] || {}
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                let value = source[prop]
                if (value !== undefined) {
                    target[prop] = value
                }
            }
        }
    }
    return target
}

export function param2Obj(url) {
    let search = url.split('?')[1]
    let result = {}
    if (!search) {
        search = url
    }
    try {
        result = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    } catch {
        result = {}
    }
    return result
}

export function formatUrl(url) {
    return new RegExp(`${url.replace(/\//g, '\\\/')}`)
}



const _roleType = mem(async () => {
    const result = await axios({
        method: "get",
        url: API.PERMISSION.ROLE_TYPE
      });
    const { data } = result || {};
    return data || [];
});


export const ROLE_TYPE_LIST =  _roleType();
