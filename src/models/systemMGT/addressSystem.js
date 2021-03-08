import { notification } from 'antd';
import {queryProvinceList} from "../../services/systemMGT/addressSystem";

export default {
  namespace: 'addressSystem',

  state: {
    provinces: [],
    cities: [],
    areas: [],
    streets: [],

  },

  effects: {
    *fetchProvinceList({payload},{call,put}){
      const response = yield call(queryProvinceList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveProvinceList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取日志列表失败',
          description: response.msg,
        });
      }
    },

  },

  reducers: {
    saveProvinceList(state,{payload}){
      return{
        ...state,
        provinces: payload,
      };
    },

  },
};
