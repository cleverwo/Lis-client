import { notification } from 'antd';
import { queryLog, getMqttType } from '../../services/systemMGT/mqttLog';

export default {
  namespace: 'mqttLog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // 搜索框内容
    formValues: {},
    // mqtt类型
    mqttType: [],
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
    // 获取mqtt类型
    *getMqttType({ callback, payload }, { call, put }) {
      const response = yield call(getMqttType);
      if (response.msgCode === 0) {
        yield put({
          type: 'setMqttType',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        notification.error({
          message: '获取mqtt类型失败',
          description: response.msg,
        });
      }
    }
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
