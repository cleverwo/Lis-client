import { message } from 'antd/lib/index';
import { queryUser } from '../../services/authorityMGT/userTransfer';

export default {
  namespace: 'userTransfer',

  state: {
    data: [],
    targetKeys: [],
    selectedKeys: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUser);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    targetKeys(state, action) {
      return {
        ...state,
        targetKeys: action.payload,
      };
    },

    selectedKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload,
      };
    },

    clear(state, actiom) {
      return {
        ...state,
        selectedKeys: [],
        targetKeys: [],
      };
    },
  },
};
