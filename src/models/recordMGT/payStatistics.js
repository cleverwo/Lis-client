import {notification, message} from 'antd';
import {
  queryList,
  queryMoneyStatisticsList,
  queryViewStatisticsList, queryViewStatisticsListOnLine,
  statisticsMoney
} from "../../services/recordMGT/payStatistics";

export default {
  namespace: 'payStatistics',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    OffLineData: {
      list: [],
      pagination: {},
    },
    OnLineData: {
      list: [],
      pagination: {},
    },
    statisticsMoneyData: 0.0,
    //搜索框是否展开
    expandSearchForm: false,
    formValues: {},
    viewOffLineData: [],
    viewOnLineData: {},
  },

  effects: {
    //单数统计列表
    * fetch({payload, callback}, {call, put}) {
      const response = yield call(queryList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录信息失败',
          description: response.msg,
        });
      }
    },
    //单数统计金额
    * fetchMoney({payload, callback}, {call, put}) {
      const response = yield call(statisticsMoney, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'setStatisticsMoneyData',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录信息失败',
          description: response.msg,
        });
      }
    },
    //线下报表列表
    * fetchOffLineStatistics({payload, callback}, {call, put}) {
      const response = yield call(queryMoneyStatisticsList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveOffLineData',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录信息失败',
          description: response.msg,
        });
      }
    },
    //线上报表列表
    *fetchOnLineStatistics({ payload, callback }, { call, put }) {
      const response = yield call(queryMoneyStatisticsList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveOnLineData',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询记录信息失败',
          description: response.msg,
        });
      }
    },

    //获取水表列表
    * viewStatistics({payload, callback}, {call, put}) {
      const response = yield call(queryViewStatisticsList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'setViewOffLineData',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '查询记录信息失败',
          description: response.msg,
        });
      }
    },
    //获取水表列表
    * viewStatisticsOnline({payload, callback}, {call, put}) {
      const response = yield call(queryViewStatisticsList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'setViewOnLineData',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '查询记录信息失败',
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
      }
    },
    saveOffLineData(state, action) {
      return {
        ...state,
        OffLineData: action.payload,
      }
    },
    saveOnLineData(state, action) {
      return {
        ...state,
        OnLineData: action.payload,
      }
    },
    //保存搜索框内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    //修改搜索框是否展开属性
    setExpandSearchForm(state, action) {
      return {
        ...state,
        expandSearchForm: action.payload,
      };
    },
    setViewOffLineData(state, action) {
      return {
        ...state,
        viewOffLineData: action.payload,
      };
    },
    setViewOnLineData(state, action) {
      return {
        ...state,
        viewOnLineData: action.payload,
      };
    },
    setStatisticsMoneyData(state, action) {
      return {
        ...state,
        statisticsMoneyData: action.payload,
      };
    },
  },
};
