import {
  addCustomer,
  changeWaterMeter,
  fetchCustomer,
  findWaterMeterCode,
  queryCustomer,
  queryOperateList,
  reCharge,
  removeCustomer,
  updateCustomer,
} from '../../services/customer/customer';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'customer',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    //用户开户分部数据
    customerInfo: {
      id: undefined,
      name: '',
      certificateType: 'IDCARD',
      certificateNumber: '',
      phone: '',
    },
    //传送水表中的操作数据
    operateList: [],
    //用户缴费用户信息
    record: {},
    //用户开户modal框显示状态
    modalVisible: false,
    viewModalVisible: false,
    changeMeterVisible: false,
    expandSearchForm: false,
    //选中行的内容
    selectedRows: [],
    //搜索框内容
    formValues: {},
    //result
    result: null,


    //更换新水表
    changeMeterNew: {},
    //更换水表需要更换的水表数据
    changeMeterOld: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCustomer, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询用户列表失败',
          description: response.msg,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCustomer, payload);
      if (response.msgCode === 0) {
        message.success('新建用户信息成功');
        if (callback) callback();
        yield put(routerRedux.push('/customer/register/result'));
        yield put({
          type: 'saveResult',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '新建用户信息失败',
          description: response.msg,
        });
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateCustomer, payload);
      if (response.msgCode === 0) {
        message.success('更新用户信息成功');
        if (callback) callback();
      } else if (response.ms === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '更新用户信息失败',
          description: response.msg,
        });
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCustomer, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else if (response.msg === 2) {
        message.info(response.msg);
      } else {
        notification.error({
          message: '删除用户信息失败',
          description: response.msg,
        });
      }
    },

    *fetchCustomer({ payload }, { call, put }) {
      const response = yield call(fetchCustomer, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveCustomer',
          payload: response.data,
        });
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    *reCharges({ payload, callback }, { call, put }) {
      const response = yield call(reCharge, payload);
      if (response.msgCode === 0) {
        message.info('充值成功,最晚明日8点到账');
        if (callback) callback();
        yield put(routerRedux.push('/customer/topUp/result'));
        yield put({
          type: 'saveReChargeId',
          payload: response.data.reChargeId,
        });
        yield put({
          type: 'saveUserId',
          payload: response.data.userId,
        });
      } else {
        message.error(response.msg);
      }
    },
    *getOperateList({ payload, callback }, { call, put }) {
      const response = yield call(queryOperateList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveOperateList',
          payload: response.data,
        });
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },

/*    *validPhone({ payload, callback }, { call }) {
      const response = yield call(validCustomerPhone, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        if (callback) callback(response.msg);
      }
    },*/
    //更改水表确认按钮
    *changeMeterModal({ payload, callback }, { call }) {
      const response = yield call(changeWaterMeter, payload);
      if (response.msgCode === 0) {
        message.success("更换水表成功");
        if (callback) callback();
      } else if (response.msg === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '更换水表失败',
          description: response.msg,
        });
      }
    },
    //校验水表账号是否存在，是否可用
    *findMeterCode({ payload, callback }, { call, put }) {
      const response = yield call(findWaterMeterCode, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveChangeMeterNew',
          payload: response.data,
        });
        if (callback) callback();
      } else if (response.msg === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '更换水表失败',
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
    saveOperateList(state, action) {
      return {
        ...state,
        operateList: action.payload,
      };
    },
    //改变modal框状态
    setModalVisible(state, action) {
      return {
        ...state,
        modalVisible: action.payload,
      };
    },
    setViewModalVisible(state, { payload }) {
      return {
        ...state,
        viewModalVisible: payload,
      };
    },
    setChangeMeterVisible(state, { payload }) {
      return {
        ...state,
        changeMeterVisible: payload,
      };
    },
    //保存选中行信息
    setSelectRows(state, action) {
      return {
        ...state,
        selectedRows: action.payload,
      };
    },
    //保存搜索框内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    //用户开户保存用户基本信息
    setCustomerInfo(state, action) {
      return {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          ...action.payload,
        },
      };
    },
    //初始化用户开户基本信息
    initCustomerInfo(state) {
      return {
        ...state,
        customerInfo: {
          name: '',
          certificateType: 'IDCARD',
          certificateNumber: '',
          phone: '',
        },
      };
    },
    //设置用户的证件类型
    setCertificateType(state, action) {
      return {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          certificateType: action.payload,
        },
      };
    },
    //保存用户信息到record中
    saveCustomer(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    //设置搜索框是否展开
    setExpandSearchForm(state, action) {
      return {
        ...state,
        expandSearchForm: action.payload,
      };
    },

    saveResult(state, action) {
      return {
        ...state,
        result: action.payload,
      };
    },
    // 保存充值记录id
    saveReChargeId(state, action) {
      return {
        ...state,
        reChargeId: action.payload,
      };
    },
    // 保存登录用户id
    saveUserId(state, action) {
      return {
        ...state,
        userId: action.payload,
      };
    },
    //保存更换水表的水表信息
    saveChangeMeterNew(state, action) {
      return {
        ...state,
        changeMeterNew: action.payload,
      };
    },
    // 保存更换水表的旧数据
    saveChangeMeterOld(state,action){
      return {
        ...state,
        changeMeterOld: action.payload,
      };
    },
  },
};
