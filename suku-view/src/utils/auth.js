const _TOKEN_NAME = process.env.ACFTICKET

export const getToken = () => {
  return window.localStorage.getItem(_TOKEN_NAME);
}

export const setToken = (tokenValue) => {
  window.localStorage.setItem(_TOKEN_NAME, tokenValue)
}

export const removeToken = () => {
  window.localStorage.removeItem(_TOKEN_NAME)
}

export function setIsLogin(value) {
  window.localStorage.setItem('isLogin', value)
}

export function getIsLogin() {
  return window.localStorage.getItem('isLogin')
}

export function removeIsLogin() {
  window.localStorage.removeItem('isLogin')
}

