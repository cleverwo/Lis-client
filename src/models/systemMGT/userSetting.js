import { notification } from 'antd';
import { getCurUserInfo, updateUserInfo } from '../../services/systemMGT/userSetting';

export default {
  namespace: 'userSetting',

  state: {
    // 用户基本信息
    userInfo: {},
  },

  effects: {
    // 获取用户基本信息
    *getUserInfo({ callback, payload }, { call, put }) {
      const response = yield call(getCurUserInfo);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        } else {
          yield put({
            type: 'setUserInfo',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取用户信息失败',
          description: response.msg,
        });
      }
    },
    // 修改用户信息
    *updateUserInfo({ callback, payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
        notification.info({
          message: '修改成功',
        });
      } else {
        notification.error({
          message: '修改用户信息失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 用户基本信息
    setUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
  },
};
