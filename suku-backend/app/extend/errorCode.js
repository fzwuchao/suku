'use strict';
const TOKEN_PAST_DUE = {
  CODE: 10001,
  MSG: 'token已经过期，请重新登录',
};
module.exports = () => {
  return { TOKEN_PAST_DUE };
};
