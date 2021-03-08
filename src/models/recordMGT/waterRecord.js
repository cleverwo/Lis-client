import { notification ,message} from 'antd';
import { queryWaterRecord, queryWaterRecordDetail } from '../../services/customer/meter';

export default {
  namespace: 'waterRecord',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    expandSearchForm: false,
    selectedRows: [],
    formValues: {},
    record: {},
    detailData: {
      list: [],
      pagination: {},
    },
    detailModalVisible: false,
    meterId: 0,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryWaterRecord, payload);
      if (response.msgCode === 0) {
        const list = response.data.list;
        if(list.length === 0){
          message.info("没有记录信息");
        }
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录列表失败',
          description: response.msg,
        });
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryWaterRecordDetail, payload);
      if (response.msgCode === 0) {
        const list = response.data.list;
        if(list.length === 0){
          message.info("没有记录信息");
        }
        yield put({
          type: 'saveDetailData',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录列表失败',
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
    initData(state) {
      return {
        ...state,
        data: {
          list: [],
          pagination: {},
        },
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
    setExpandSearchForm(state, action) {
      return {
        ...state,
        expandSearchForm: action.payload,
      };
    },
    saveDetailData(state, { payload }) {
      return {
        ...state,
        detailData: payload,
      };
    },
    setDetailModalVisible(state, { payload }) {
      return {
        ...state,
        detailModalVisible: payload,
      };
    },
    setMeterId(state, { payload }) {
      return {
        ...state,
        meterId: payload,
      };
    },
  },
};
