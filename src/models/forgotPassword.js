import {
  sendAuthCodeForgotPassword,
  forgotPasswordByPhone,
  forgotPasswordByMail,
  checkoutPhoneNext,
  checkoutPhoneIsEmpty,
} from '../services/security';
import { message } from 'antd/lib/index';

export default {
  namespace: 'forgotPassword',

  state: {
    status: undefined,
    type: null,
    password: null,
    passwordAgain: null,
    phone: null,
  },

  effects: {
    *phoneSubmit({ payload, callback }, { call, put }) {
      const response = yield call(forgotPasswordByPhone, payload);
      if (response.msgCode === 0) {
        message.success('密码修改成功，请重新登录！');
        if (callback) callback();
      } else if (response.msgCode === 1) {
        message.error(response.msg);
      } else {
        message.error(response.msg);
      }
    },
    *mailSubmit({ payload, callback }, { call, put }) {
      const response = yield call(forgotPasswordByMail, payload);
      yield put({
        payload: response,
      });
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
    *sendAuthCodeForgotPassword({ payload, callback }, { call, put }) {
      const response = yield call(sendAuthCodeForgotPassword, payload);
      if (response.msgCode === 0) {
        message.success('发送验证码成功');
      } else {
        message.error('发送验证码失败');
      }
    },
    *checkoutPhoneNext({ payload, callback }, { call, put }) {
      const response = yield call(checkoutPhoneNext, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else if (response.msgCode === 1) {
        message.error(response.msg);
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    savePassword(state, { payload }) {
      return {
        ...state,
        password: payload,
      };
    },
    savePasswordAgain(state, { payload }) {
      return {
        ...state,
        passwordAgain: payload,
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
