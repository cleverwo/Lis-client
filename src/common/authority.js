import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import { getToken, getAuthority } from '../utils/authority';
import store from '../index.js';
import { setRefreshAfterLogin } from '../utils/authority';

//TODO:暂时让服务器返回400表示没有权限
function doCheck(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error('鉴权失败');
  error.name = response.status;
  error.response = response;
  //console.log('鉴权失败')
  throw error;
}

export function checkPermission(curAuthority) {
  const username = getAuthority();
  const params = { username: username, authority: curAuthority };
  console.log('------------------', curAuthority);
  const options = {};
  const token = getToken();
  if (token == undefined) {
    options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
  } else {
    options.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }
  options.method = 'POST';
  options.body = JSON.stringify(params);
  return fetch('/admin/checkPermission', options).then(doCheck);
}

export function checkLogin() {
  const token = getToken();
  const options = {};
  if (!token) {
    return false;
    options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
  } else {
    options.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }
  options.method = 'GET';
  return fetch('/admin/checkLogin', options)
    .then(doCheck)
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        dispatch(routerRedux.push('/user/login'));
        setRefreshAfterLogin(true); //登陆后触发强制刷新，组件全刷新
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
