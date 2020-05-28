const _TOKEN_NAME = 'x-csrf-token';

const _getToken = () => {
  return window.localStorage.getItem(_TOKEN_NAME);
}

const _setToken = (tokenValue) => {
  window.localStorage.setItem(_TOKEN_NAME, tokenValue)
}

const _removeToken = () => {
  window.localStorage.removeItem(_TOKEN_NAME)
}

export default {
  TOKEN_NAME: _TOKEN_NAME,
  getToken: _getToken,
  setToken: _setToken,
  removeToken: _removeToken
}
