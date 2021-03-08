import { notification } from 'antd';
import {
  queryCompanyList,
  queryLog,
} from '../../services/systemMGT/operationLog';

export default {
  namespace: 'operationLog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // 搜索框内容
    formValues: {},
    // 公司下拉框
    companyList: [],
    // 是否展开查询条件
    expandSearchForm: false,
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
    // 公司下拉框
    *getCompanyList({ callback, payload }, { call, put }) {
      const response = yield call(queryCompanyList);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
        notification.error({
          message: '获取公司列表失败',
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
    // 公司下拉框
    saveCompanyList(state, action) {
      return {
        ...state,
        companyList: action.payload,
      };
    },
    // 设置搜索框是否展开
    setExpandSearchForm(state, action) {
      return {
        ...state,
        expandSearchForm: action.payload,
      };
    },
    //保存搜索框内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
  },
};
