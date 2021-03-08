import { querySystemLog } from '../../services/adminmgt/opearteLog';
import { message } from 'antd/lib/index';

export default {
  namespace: 'operateLog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    formValues: {},
    logType: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySystemLog, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'setDate',
          payload: response.data,
        });
      } else {
        message.error('查询操作记录失败:' + response.msg);
      }
    },
  },
  reducers: {
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    setDate(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setLogType(state, action) {
      return {
        ...state,
        logType: action.payload,
      };
    },
  },
};
