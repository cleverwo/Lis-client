import { routerRedux } from 'dva/router';
import {
  preLogin,
  login,
  logout,
  changePwd,
  sendAuthCode,
  phoneLogin,
  checkoutPhoneIsEmpty,
} from '../services/security';
import { setAuthority, setToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { notification } from 'antd';
import { setRefreshAfterLogin, getRefreshAfterLogin } from '../utils/authority';
import { message } from 'antd/lib/index';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    type: null,
    phone: null,
  },

  effects: {
    //登录前向服务器申请公钥
    *pre({ callback }, { call, put }) {
      const preResp = yield call(preLogin);
      if (preResp.msgCode != 0) {
        notification.error({
          message: '获取验证信息失败',
          description: preResp.msg,
        });
        return;
      }
      if (callback) {
        callback(preResp.data.encoded);
      }
    },
    *changePwd({ payload, callback }, { call, put }) {
      const repse = yield call(changePwd, payload);
      if (repse.msgCode != 0) {
        notification.error({
          message: '获取验证信息失败',
          description: repse.msg,
        });
        return;
      }
      if (callback) {
        callback();
      }
      message.success('修改密码成功');
    },
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      let info = {};
      info.status = response.msgCode;
      info.type = payload.type;
      info.currentAuthority = response.data.currentAuthority;
      info.token = response.data.token;
      yield put({
        type: 'changeLoginStatus',
        payload: info,
      });
      // Login successfully
      if (response.msgCode === 0) {
        yield put(routerRedux.push('/test'));
        //token超时或者被其他人登录导致token失效之后，重新登录强制刷新页面
        /*if (!!getRefreshAfterLogin()) {
          console.log("token 过期，重新登录")
          setRefreshAfterLogin(false);
          window.location.reload(true);
        }*/
      } else {
        notification.error({
          message: '登录失败',
          description: response.msg,
        });
      }
    },
    *checkoutPhoneIsEmpty({ payload }, { call, put }) {
      const response = yield call(checkoutPhoneIsEmpty, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'savePhone',
          payload: payload,
        });
      } else {
        message.error(response.msg);
      }
    },
    *sendAuthCode({ payload }, { call, put }) {
      const response = yield call(sendAuthCode, payload);
      if (response.msgCode === 0) {
        message.success('发送验证码成功');
      } else {
        message.error('发送验证码失败');
      }
    },
    *phoneLogin({ payload }, { call, put }) {
      const response = yield call(phoneLogin, payload);
      let info = {};
      info.status = response.msgCode;
      info.type = payload.type;
      info.currentAuthority = response.data.currentAuthority;
      info.token = response.data.token;
      yield put({
        type: 'changeLoginStatus',
        payload: info,
      });
      // Login successfully
      if (response.msgCode === 0) {
        yield put(routerRedux.push('/'));
        //token超时或者被其他人登录导致token失效之后，重新登录强制刷新页面
        if (!!getRefreshAfterLogin()) {
          setRefreshAfterLogin(false);
          window.location.reload(true);
        }
      } else {
        notification.error({
          message: '登录失败',
          description: response.msg,
        });
      }
    },
    *logout({ payload }, { call, put, select }) {
      let needLogout = false;
      if (payload && payload.logoutfailed) {
        needLogout = true;
      } else {
        const response = yield call(logout);
        if (response.msgCode == 0) {
          needLogout = true;
        } else {
          notification.error({
            message: '登出失败',
            description: response.msg,
          });
        }
      }
      const status = yield select(state => state.status);
      console.log(status);
      if (needLogout && status != false) {
        if (payload && payload.Unauthorized) {
          notification.error({
            message: '登出系统',
            description: '用户登录超时或者有其他人登录了该用户',
          });
        }
        try {
          // get location pathname
          const urlParams = new URL(window.location.href);
          const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          urlParams.searchParams.set('redirect', pathname);
          window.history.replaceState(null, 'login', urlParams.href);
        } finally {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: false,
              currentAuthority: 'guest',
            },
          });
          setRefreshAfterLogin(true);
          reloadAuthorized();
          yield put(routerRedux.push('/user/login'));
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setToken(payload.token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    savePhone(state, { payload }) {
      return {
        ...state,
        phone: payload,
      };
    },
  },
};
