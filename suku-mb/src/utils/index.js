import { Toast } from 'vant';
import axios from 'axios';
export function getOpenId() {
  // sessionStorage.setItem('openId', 'on2l30nibxGCb_u4wb3T2Fs02MM8');
  // 清除开发阶段存入的测试openId odrqo082xuKdbE_c5ceeRxGINCqc
  if (localStorage.getItem('openId')) {
    localStorage.removeItem('openId');
  }
  if (sessionStorage.getItem('openId')) {
    return new Promise((resolve) => {
      resolve(sessionStorage.getItem('openId'));
    });
  }
  let url;
  if (location.href.indexOf('code') > -1) {
    url = location.href;
  } else {
    Toast({duration: 0, message: '请在微信客户端打开链接'});
    return;
  }
  let list = url.split('?');
  let paramList = list[1].split('&');
  let codeList = paramList[0].split('=');
  return new Promise((resolve) => {
    axios({
      method: 'get',
      url: '/wechat/getOpenId',
      params: {
        code: codeList[1]
      }
    }).then((res) => {
      // if (res.data.code === 200) {
      //   sessionStorage.setItem('openId', res.data.data.openid);
         resolve(res);
      // }
    });
  });
}