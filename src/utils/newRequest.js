import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { getToken } from './authority';

const returnMsg = require('../components/_utils/returnMessage_pb'); // protobuf解析出来的js

function isEmpty(obj) {
  return obj == undefined || obj == '';
}
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function newRequest(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  // token添加到header
  const token = getToken();
  if (token == undefined) {
    newOptions.headers = { ...newOptions.headers };
  } else {
    newOptions.headers = { Authorization: `Bearer ${token}`, ...newOptions.headers };
  }

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'PATCH' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      if (newOptions.body == undefined || newOptions.body == '' || newOptions.body == null) {
        // 避免后端在@RequestBody中配置required=false以及判空操作
        newOptions.body = '{}';
      } else {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(resp => {
      // console.log("resp",resp)
      return resp.arrayBuffer().then((buf) => {
        // console.log("处理后resp",resp)
        // console.log("处理后buf",buf)
        let msg;
        // console.log("这个是pb解密吗，感觉不对",msg)
        try {
          msg = proto.return_message.deserializeBinary(buf);
        } catch (e) {
          // console.log(buf);
          // console.log('newRequest error:' + e);
          return { msgCode: 999, msg: `decode failed:${  e}` };
        }
        const ret = {};
        ret.msgCode = isEmpty(msg.getMsgCode()) ? 0 : msg.getMsgCode();
        ret.msg = msg.getMsg();
        ret.data = isEmpty(msg.getData()) ? {} : JSON.parse(msg.getData());
        // console.log("这个是返回的值看看是什么”",ret);
        return ret;
      });
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
          payload: url.indexOf('logout') < 0 ? { Unauthorized: true } : { logoutfailed: true },
        });
      }
      return { msgCode: 0 }; // 反正都登出了，返回0就算更改数据也无所谓了
    });
}
