import { notification } from 'antd';
import {
  queryPriceList,
  queryWaterPriceList,
  deletePrice,
  getPriceDetail,
  addWaterPrice,
  updateWaterPrice,
  updateStaircasePrice,
  validPriceName,
  queryHallWaterPrice,
} from '../../services/waterPriceMGT/waterPrice';

export default {
  namespace: 'waterPrice',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    editPriceVisible: false,
    staircaseModalVisible: false,
    selectedRows: [],
    formValues: {},
    viewModalVisible: false,
    record: {},

    waterPriceList: [],
    waterPriceDetail: {
      priceId: 0,
      priceName: '',
      additionalFee: 0.0,
      composeList: [],
      staircaseList: [],
    },
  },

  effects: {
    // 条件查询水价列表
    *fetch({ callback, payload }, { call, put }) {
      const response = yield call(queryPriceList, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'fillPriceList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取水价列表失败',
          description: response.msg,
        });
      }
    },
    //获取水价列表 查所有的
    *fetchList({ callback }, { call, put }) {
      const response = yield call(queryWaterPriceList);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'saveWaterPriceList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取水价列表失败',
          description: response.msg,
        });
      }
    },
    // 删除水价
    *deletePrice({ callback, payload }, { call, put }) {
      const response = yield call(deletePrice, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '删除水价失败',
          description: response.msg,
        });
      }
    },
    // 获取水价详情
    *fetchDetail({ callback, payload }, { call, put }) {
      const response = yield call(getPriceDetail, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'setPriceDetail',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取水价详情失败',
          description: response.msg,
        });
      }
    },
    // 新增水价
    *addWaterPrice({ callback, payload }, { call, put }) {
      const response = yield call(addWaterPrice, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '新增水价失败',
          description: response.msg,
        });
      }
    },
    // 修改水价
    *updateWaterPrice({ callback, payload }, { call, put }) {
      const response = yield call(updateWaterPrice, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '修改水价失败',
          description: response.msg,
        });
      }
    },
    // 修改阶梯水价
    *updateStaircasePrice({ callback, payload }, { call, put }) {
      const response = yield call(updateStaircasePrice, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '修改阶梯水价失败',
          description: response.msg,
        });
      }
    },
    // 校验水价名称
    *validPriceName({ payload, callback }, { call }) {
      const response = yield call(validPriceName, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        if (callback) callback(response.msg);
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
    setEditPriceVisible(state, action) {
      return {
        ...state,
        editPriceVisible: action.payload,
      };
    },
    //保存水价下拉框内容
    saveWaterPriceList(state, { payload }) {
      return {
        ...state,
        waterPriceList: payload,
      };
    },
    // 阶梯水价modal框
    setStaircaseModalVisible(state, action) {
      return {
        ...state,
        staircaseModalVisible: action.payload,
      };
    },
    // 查看水价详情modal框
    setViewModalVisible(state, action) {
      return {
        ...state,
        viewModalVisible: action.payload,
      };
    },
    // 选择水价
    setSelectRows(state, { payload }) {
      const idList = [];
      for (var i = 0; i < payload.length; i++) {
        idList.push(payload[i].id);
      }
      return {
        ...state,
        selectedRows: idList,
      };
    },
    // 水价列表赋值
    fillPriceList(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    //设置搜索框中的内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    // 查看水价信息
    setRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    // 水价详情
    setPriceDetail(state, action) {
      return {
        ...state,
        waterPriceDetail: action.payload,
      };
    },
    // 设置附加费用
    setAdditionalFee(state, action) {
      return {
        ...state,
        additionalFee: action.payload,
      };
    }
  },
};
