import {
  addAuth,
  checkAuthName,
  patchAuth,
  queryAuth,
  queryTreeNode,
  removeAuth,
} from '../../services/authorityMGT/authSetting';
import { notification } from 'antd/lib/index';

export default {
  namespace: 'authSetting',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    modalFuncVisible: false,
    isEdit: false,
    record: {},
    selectedRows: [],
    formValues: {},
    treeNode: [],

    checkedFunc: [],
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],

    isUpdate: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAuth, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'setDate',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询补货记录失败',
          description: response.msg,
        });
      }
    },
    *remove({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(removeAuth, payload);
      if (response.msgCode == 0) {
        if (callback) callback();
      } else {
        notification.error(response.msg);
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addAuth, payload);
      if (response.msgCode == 0) {
        if (callback) callback();
      } else {
        notification.error(response.msg);
      }
    },
    *patch({ payload, callback }, { call, put }) {
      const response = yield call(patchAuth, payload);
      if (response.msgCode == 0) {
        if (callback) callback();
      } else {
        notification.error(response.msg);
      }
    },
    *authNameCheck({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(checkAuthName, payload);
      if (response.msgCode != 0) {
        callback(response.msg);
      } else {
        callback();
      }
    },
    *getAllTreeNode({ payload, callback }, { call, put }) {
      const response = yield call(queryTreeNode, payload);
      console.log(response.data);
      if (response.msgCode == 0) {
        //const trees = getTreeNode(response.data);
        yield put({
          type: 'setTreeNode',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询补货记录失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    setDate(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setModal(state, action) {
      return {
        ...state,
        modalVisible: action.payload.modalVisible,
        isEdit: action.payload.isEdit,
      };
    },
    setRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    setSelectedRows(state, action) {
      return {
        ...state,
        selectedRows: action.payload,
      };
    },
    setFuncVisible(state, action) {
      return {
        ...state,
        modalFuncVisible: action.payload,
      };
    },
    setTreeNode(state, action) {
      return {
        ...state,
        treeNode: action.payload,
      };
    },
    setCheckFunc(state, action) {
      return {
        ...state,
        checkedFunc: action.payload,
      };
    },
    setExpandedKeys(state, action) {
      return {
        ...state,
        expandedKeys: action.payload,
      };
    },
    setAutoExpandParent(state, action) {
      return {
        ...state,
        autoExpandParent: action.payload,
      };
    },
    setSelectedKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload,
      };
    },
    setUpdateSign(state, action) {
      return {
        ...state,
        isUpdate: action.payload,
      };
    },
  },
};
