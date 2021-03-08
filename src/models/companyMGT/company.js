import { notification, message } from 'antd';
import {
  getHallSimpleList,
  getBranchCoSimpleList,
  queryBranchCoList,
  deleteCo,
  addBranchCo,
  updateBranchCo,
  queryBusinessHallList,
  addBusinessHall,
  updateBusinessHall,
  getThisCoInfo,
  updateThisCo,
} from '../../services/companyMGT/company';

export default {
  namespace: 'company',

  state: {
    // 子公司列表
    branchCoData: {
      list: [],
      pagination: {},
    },
    // 大厅列表
    businessHallData: {
      list: [],
      pagination: {},
    },
    // 子公司搜索框
    branchCoFormValues: {},
    // 大厅搜索框
    hallFormValues: {},
    // 大厅列表下拉框
    businessHallList: [],
    // 子公司列表下拉框
    branchCoList: [],
    // 添加子公司modal
    addBranchCoVisible: false,
    // 查看公司信息modal
    viewCompanyVisible: false,
    // 添加大厅modal
    addHallVisible: false,
    // 修改子公司modal
    editBranchCoVisible: false,
    // 修改大厅modal
    editHallVisible: false,
    // 查看公司的信息
    record: {},
    // 查看本公司信息
    thisCoInfo: {},
  },

  effects: {
    // 获取大厅下拉框
    *getHallSimpleList({ callback }, { call, put }) {
      const response = yield call(getHallSimpleList);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'saveBusinessHallList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取服务大厅列表失败',
          description: response.msg,
        });
      }
    },
    // 获取子公司下拉框
    *getBranchCoSimpleList({ callback }, { call, put }) {
      const response = yield call(getBranchCoSimpleList);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'saveBranchCoList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取子公司列表失败',
          description: response.msg,
        });
      }
    },
    // 获取子公司列表
    *fetchBranchCo({ callback, payload }, { call, put }) {
      const response = yield call(queryBranchCoList, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'fillBranchCoList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取子公司列表失败',
          description: response.msg,
        });
      }
    },
    // 获取子公司列表
    *fetchBusinessHall({ callback, payload }, { call, put }) {
      const response = yield call(queryBusinessHallList, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'fillBusinessHallList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取大厅列表失败',
          description: response.msg,
        });
      }
    },
    // 删除公司
    *remove({ callback, payload }, { call, put }) {
      const response = yield call(deleteCo, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '删除公司失败',
          description: response.msg,
        });
      }
    },
    // 添加子公司
    *addBranchCo({ callback, payload }, { call, put }) {
      const response = yield call(addBranchCo, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '添加公司失败',
          description: response.msg,
        });
      }
    },
    // 修改子公司
    *updateBranchCo({ callback, payload }, { call, put }) {
      const response = yield call(updateBranchCo, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '修改公司信息失败',
          description: response.msg,
        });
      }
    },
    // 添加服务大厅
    *addBusinessHall({ callback, payload }, { call, put }) {
      const response = yield call(addBusinessHall, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '添加服务大厅失败',
          description: response.msg,
        });
      }
    },
    // 修改大厅
    *updateBusinessHall({ callback, payload }, { call, put }) {
      const response = yield call(updateBusinessHall, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '修改大厅信息失败',
          description: response.msg,
        });
      }
    },
    // 获取本公司信息
    *getThisCoInfo({ callback, payload }, { call, put }) {
      const response = yield call(getThisCoInfo);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'setThisCoInfo',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取本公司信息失败',
          description: response.msg,
        });
      }
    },
    // 修改本公司信息
    *updateThisCompany({ callback, payload }, { call, put }) {
      const response = yield call(updateThisCo, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        } else {
          message.success('修改成功！');
        }
      } else {
        notification.error({
          message: '修改本公司信息失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 保存大厅列表下拉框内容
    saveBusinessHallList(state, { payload }) {
      return {
        ...state,
        businessHallList: payload,
      };
    },
    // 保存子公司列表下拉框内容
    saveBranchCoList(state, { payload }) {
      return {
        ...state,
        branchCoList: payload,
      };
    },
    // 添加子公司modal显示状态
    setAddBranchCoVisible(state, action) {
      return {
        ...state,
        addBranchCoVisible: action.payload,
      };
    },
    // 查看公司信息modal
    setViewCompanyVisible(state, action) {
      return {
        ...state,
        viewCompanyVisible: action.payload,
      };
    },
    // 添加大厅modal显示状态
    setAddHallVisible(state, action) {
      return {
        ...state,
        addHallVisible: action.payload,
      };
    },
    // 修改子公司modal显示
    setEditBranchCoVisible(state, action) {
      return {
        ...state,
        editBranchCoVisible: action.payload,
      };
    },
    // 修改大厅modal显示状态
    setEditHallVisible(state, action) {
      return {
        ...state,
        editHallVisible: action.payload,
      };
    },
    // 设置子公司搜索框中的内容
    setBranchCoFormValues(state, action) {
      return {
        ...state,
        branchCoFormValues: action.payload,
      };
    },
    // 设置大厅搜索框中的内容
    setHallFormValues(state, action) {
      return {
        ...state,
        hallFormValues: action.payload,
      };
    },
    // 子公司列表赋值
    fillBranchCoList(state, { payload }) {
      return {
        ...state,
        branchCoData: payload,
      };
    },
    // 大厅列表赋值
    fillBusinessHallList(state, { payload }) {
      return {
        ...state,
        businessHallData: payload,
      };
    },
    // 查看公司的信息
    saveRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    // 查看本公司信息
    setThisCoInfo(state, { payload }) {
      return {
        ...state,
        thisCoInfo: payload,
      };
    },
  },
};
