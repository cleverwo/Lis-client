import { notification, message } from 'antd';
import {getProductList} from "../../services/systemMGT/ctwing";

export default {
  namespace: 'product',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    formValues: {},
    productList: [],

  },

  effects: {
    //获取产品列表 查所有的
    *fetchList({ callback }, { call, put }) {
      const response = yield call(getProductList);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveProductList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取电信产品列表失败',
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
    //改变modal框显示状态
    setModalVisible(state, action) {
      return {
        ...state,
        modalVisible: action.payload,
      };
    },
    //改变modal框显示状态
    saveProductList(state, action) {
      return {
        ...state,
        productList: action.payload,
      };
    },
  },
};
