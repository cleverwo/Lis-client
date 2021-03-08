import { message } from 'antd/lib/index';
import { listAll } from '../../services/merchant/business';

export default {
  namespace: 'merchantTransfer',

  state: {
    merchants: [],
    targetMerchants: [],
    selectedMerchants: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(listAll, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'merchants',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    merchants(state, action) {
      return {
        ...state,
        merchants: action.payload,
      };
    },

    targetMerchants(state, action) {
      return {
        ...state,
        targetMerchants: action.payload,
      };
    },

    selectedMerchants(state, action) {
      return {
        ...state,
        selectedMerchants: action.payload,
      };
    },

    clear(state, actiom) {
      return {
        ...state,
        targetMerchants: [],
        selectMerchants: [],
      };
    },
  },
};
