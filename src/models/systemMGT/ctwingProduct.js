import { notification } from 'antd';
import { queryProductList, refreshProductList } from '../../services/systemMGT/ctwing';

export default {
  namespace: 'ctwingProduct',

  state: {
    data: [],
  },

  effects: {
    // 获取产品列表
    *fetch({ callback }, { call, put }) {
      const response = yield call(queryProductList);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        notification.error({
          message: '获取产品列表失败',
          description: response.msg,
        });
      }
    },
    *refresh({ callback, payload }, { call, put }) {
      const response = yield call(refreshProductList);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        notification.error({
          message: '刷新产品列表失败',
          description: response.msg,
        });
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
  },
};
