import { notification, message } from 'antd';

export default {
  namespace: 'sample',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    selectedRows: [],
    expandSearchForm: false,
    addModalVisible: false,

    viewModalVisible: false,
    requestModalVisible: false,
    uploadModalVisible: false,
    setTimeModalVisible: false,
    notSetTimeModalVisible: false,
    uploadImeiModalVisible: false,
    formValues: {},
    record: {},
    setTimeResult: '',
    operateList: [],
    requestList: [],
    history: {},
    uploading: false,
    fileList: [],
  },

  effects: {

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
    //设置搜索框是否展开
    setExpandSearchForm(state, action) {
      return {
        ...state,
        expandSearchForm: action.payload,
      };
    },
    //保存选中行信息
    setSelectRows(state, action) {
      return {
        ...state,
        selectedRows: action.payload,
      };
    },
    //保存选中行信息
    setAddModalVisible(state, action) {
      return {
        ...state,
        addModalVisible: action.payload,
      };
    },
  },
};
