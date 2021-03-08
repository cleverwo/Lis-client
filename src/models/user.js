import {
  findList,
  findCurrent,
  findAuthorities,
  findUnreadNoticeCnt,
  checkPhoneUnique,
} from '../services/user';
import { getAuthority } from '../utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    authorities: [],
  },

  effects: {
    //获取用户基本信息列表，用于SearchInput下拉框
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(findList, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(response.data);
        }
      } else {
        notification.error({
          message: '获取人员列表失败',
          description: response.msg,
        });
      }
    },
    //获取用户未读消息条数
    *fetchNotifyCount(_, { call, put }) {
      const response = yield call(findUnreadNoticeCnt);
      if (response.msgCode == 0) {
        yield put({
          type: 'changeNotifyCount',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取人员列表失败',
          description: response.msg,
        });
      }
    },
    //获取当前用户信息
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(findCurrent);
      if (response.msgCode == 0) {
        let data = response.data;
        yield put({
          type: 'currentUser',
          payload: data,
        });
        if (callback) {
          callback(data);
        }
      } else {
        notification.error({
          message: '获取当前用户基础信息失败',
          description: response.msg,
        });
      }
    },
    //获取用户权限列表
    *fetchAuthorities({ callback }, { call, put }) {
      const authority = getAuthority();
      const response = yield call(findAuthorities, { username: authority });
      if (response.msgCode == 0) {
        yield put({
          type: 'authorities',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '获取用户权限失败',
          description: response.msg,
        });
      }
    },
    *checkPhoneUnique({ payload, callback }, { call, put }) {
      const response = yield call(checkPhoneUnique, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback();
        }
      } else {
        if (callback) {
          callback(response.msg);
        }
      }
    },
  },

  reducers: {
    currentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    authorities(state, action) {
      return {
        ...state,
        authorities: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.count ? action.payload.count : 0,
        },
      };
    },
  },
};
