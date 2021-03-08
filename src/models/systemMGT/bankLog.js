import { notification } from 'antd';
import { queryLog } from '../../services/systemMGT/bankLog';

export default {
  namespace: 'bankLog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // 搜索框内容
    formValues: {},
  },

  effects: {
    // 获取日志
    *fetch({ callback, payload }, { call, put }) {
      const response = yield call(queryLog, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        notification.error({
          message: '获取日志列表失败',
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
    //保存搜索框内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    setMqttType(state, action) {
      return {
        ...state,
        mqttType: action.payload,
      }
    },
  },
};