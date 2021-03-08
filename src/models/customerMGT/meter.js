import { notification, message } from 'antd';
import { queryMeters } from '../../services/customer/meter';

export default {
  namespace: 'meter',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    viewModalVisible: false,
    record: {},

    allWaterPrice: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMeters, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询水表列表失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    //保存查询后的结果级
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    //设置modalVisible的值
    setModalVisible(state, action) {
      return {
        ...state,
        modalVisible: action.data,
      };
    },
    //设置选中行信息
    setSelectRows(state, action) {
      return {
        ...state,
        selectedRows: action.payload,
      };
    },
    //设置搜索框中的内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },

    //设置选中的属性
    setRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
  },
};
