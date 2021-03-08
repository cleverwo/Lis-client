import { notification, message } from 'antd';
import { queryDataAlarmList, queryDeviceAlarmList, processDeviceAlarm, processDataAlarm } from '../../services/alarmMGT/alarm';

export default {
  namespace: 'alarm',

  state: {
    alarmData: {
      list: [],
      pagination: {},
    },
    record: {},
    formValues: {},
    alarmDetailVisible: false,
  },

  effects: {
    *fetchDataAlarmList({ callback, payload }, { call, put }) {
      const response = yield call(queryDataAlarmList, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'fillAlarmList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取数据报警信息列表失败',
          description: response.msg,
        });
      }
    },
    *fetchDeviceAlarmList({ callback, payload }, { call, put }) {
      const response = yield call(queryDeviceAlarmList, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'fillAlarmList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '获取设备报警信息列表失败',
          description: response.msg,
        });
      }
    },
    *processDeviceAlarm({ callback, payload }, { call, put }) {
      const response = yield call(processDeviceAlarm, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '处理报警信息失败',
          description: response.msg,
        });
      }
    },
    *processDataAlarm({ callback, payload }, { call, put }) {
      const response = yield call(processDataAlarm, payload);
      if (response.msgCode === 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '处理报警信息失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 警报点击记录
    setRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    // 报警详情modal显示
    setAlarmDetailVisible(state, action) {
      return {
        ...state,
        alarmDetailVisible: action.payload,
      };
    },
    // 报警列表记录
    fillAlarmList(state, action) {
      return {
        ...state,
        alarmData: action.payload,
      };
    },
    // 查询参数
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
  },
};
