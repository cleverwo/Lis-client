import { message, notification } from 'antd/lib/index';
import {
  queryWithdrawMoneyAudit,
  checkWithdraw,
  queryBusiness,
  add,
  queryBankCard,
} from '../../services/personcenter/withdrawMoneyAudit';
import { queryEnumeration } from '../../services/core/common';

export default {
  namespace: 'withdrawMoneyAudit',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    Business: [],
    BankCard: [],
    Status: [],
    formValues: {},
    record: {},
    expandForm: false,
    visible: false,
    modalVisible: false,
    createApprovalModalVisible: false,
    withdrawApprovalId: '',
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWithdrawMoneyAudit, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'setDate',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询退款记录失败',
          description: response.msg,
        });
      }
    },
    *fetchEnum({ payload, callback }, { call, put }) {
      const response = yield call(queryEnumeration, { enumType: payload.enumType });
      if (response.msgCode === 0) {
        yield put({
          type: payload.reduxType,
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '获取枚举数据失败',
          description: response.msg,
        });
      }
    },
    *fetchBusiness({ payload }, { call, put }) {
      const response = yield call(queryBusiness, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'saveBusiness',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询商户总收入失败',
          description: response.msg,
        });
      }
    },
    *fetchBankCard({ payload }, { call, put }) {
      const response = yield call(queryBankCard, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'saveBankCard',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询商户总收入失败',
          description: response.msg,
        });
      }
    },
    *checkWithdraw({ payload, callback }, { call, put }) {
      const response = yield call(checkWithdraw, payload);
      if (response.msgCode != 0) {
        callback(response.msg);
      } else {
        callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if (response.msgCode === 0) {
        message.success('提现请求成功，待审核');
        if (callback) callback(true);
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '提现请求失败',
          description: response.msg,
        });
      }
    },
  },
  reducers: {
    saveBusiness(state, action) {
      return {
        ...state,
        Business: action.payload,
      };
    },
    saveBankCard(state, action) {
      return {
        ...state,
        BankCard: action.payload,
      };
    },
    saveStatus(state, action) {
      return {
        ...state,
        Status: action.payload,
      };
    },
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
    saveExpandForm(state, action) {
      return {
        ...state,
        expandForm: !state.expandForm,
      };
    },
    saveVisible(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
    saveRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    saveModalVisible(state, action) {
      return {
        ...state,
        modalVisible: action.payload,
      };
    },
    saveWithdrawId(state, action) {
      return {
        ...state,
        withdrawApprovalId: action.payload,
      };
    },
    createApprovalModalVisible(state, action) {
      return {
        ...state,
        createApprovalModalVisible: action.payload,
      };
    },
  },
};
