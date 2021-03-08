import { notification } from 'antd';
import { queryPayRecordOffline, queryPayRecordOnline } from '../../services/waterPriceMGT/payRecord';

export default {
  namespace: 'payRecord',

  state: {
    // 列表数据-线下
    dataOffline: {
      list: [],
      pagination: {},
    },
    // 搜索框数据
    formValuesOffline: {},

    // 列表数据-线上
    dataOnline: {
      list: [],
      pagination: {},
    },
    // 搜索框数据
    formValuesOnline: {},
  },

  effects: {
    // 获取数据
    *fetchOffline({ payload, callback }, { call, put }) {
      const response = yield call(queryPayRecordOffline, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveDataOffline',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录列表失败',
          description: response.msg,
        });
      }
    },
    *fetchOnline({ payload, callback }, { call, put }) {
      const response = yield call(queryPayRecordOnline, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveDataOnline',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录列表失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 保存查询后的结果
    saveDataOffline(state, action) {
      return {
        ...state,
        dataOffline: action.payload,
      };
    },
    saveDataOnline(state, action) {
      return {
        ...state,
        dataOnline: action.payload,
      };
    },
    //设置搜索框中的内容
    setFormValuesOffline(state, action) {
      return {
        ...state,
        formValuesOffline: action.payload,
      };
    },
    setFormValuesOnline(state, action) {
      return {
        ...state,
        formValuesOnline: action.payload,
      };
    },
  },
};
