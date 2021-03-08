import { notification, message } from 'antd';
import { queryChangeRecord } from '../../services/waterPriceMGT/waterMeterChange';

export default {
  namespace: 'waterMeterChange',

  state: {
    // 水表更换记录
    record: {
      changeRecord: {
        list: [],
        pagination: {},
      },
    },
    // 搜索框数据
    searchFormValues: {},
  },

  effects: {
    *fetch({ callback, payload }, { call, put }) {
      const response = yield call(queryChangeRecord, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        }
        yield put({
          type: 'saveRecord',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询水表更换记录失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 保存水表更换记录
    saveRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    // 保存搜索框数据
    saveSearchFormValues(state, action) {
      return {
        ...state,
        searchFormValues: action.payload,
      };
    },
  },
};
