import { notification, message } from 'antd';
import {
  changeMeterStatus,
  queryWaterMeters,
  removeWaterMeter,
  updateMeter,
  queryOperateList,
  queryRequestList,
  setMeterRequest,
  meterSettlementDate,
  meterStandardTime,
  meterSyncData,
  meterIpAddress,
  meterSubmissionTime,
  meterWarnParameter,
  meterOffline,
  validWaterMeterCode,
  addMeter,
  meterBalance,
  meterWaterPrice,
  meterWaterAddress,
  meterValueControl,
  batchAddMeter,
  validIMEICode,
  batchSetReportTime,
  findNotSetTimeMeter,
  uploadImeiList,
} from '../../services/customer/meter';

export default {
  namespace: 'waterMeter',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
    expandSearchForm: false,
    viewModalVisible: false,
    requestModalVisible: false,
    addModalVisible: false,
    uploadModalVisible: false,
    setTimeModalVisible: false,
    notSetTimeModalVisible: false,
    uploadImeiModalVisible: false,
    selectedRows: [],
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
    //获取水表列表
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryWaterMeters, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询水表列表失败',
          description: response.msg,
        });
      }
    },
    //新增水表基本信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addMeter, payload);
      if (response.msgCode === 0) {
        message.success('新增水表信息成功');
        if (callback) callback();
      } else if (response.ms === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '新增水表信息失败',
          description: response.msg,
        });
      }
    },
    //更新水表基本信息
    *update({ payload, callback }, { call }) {
      const response = yield call(updateMeter, payload);
      if (response.msgCode === 0) {
        message.success('更新水表信息成功');
        if (callback) callback();
      } else if (response.ms === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '更新水表信息失败',
          description: response.msg,
        });
      }
    },
    //删除水表
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeWaterMeter, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else if (response.msg === 2) {
        message.info(response.msg);
      } else {
        notification.error({
          message: '删除信息失败',
          description: response.msg,
        });
      }
    },
    //水表阀门控制
    *changeStatus({ payload, callback }, { call }) {
      const response = yield call(changeMeterStatus, payload);
      if (response.msgCode === 0) {
        if (callback) callback(true);
      } else {
        notification.error({
          message: '更新水表状态失败',
          description: response.msg,
        });
      }
    },
    //获取水表操作记录历史
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
    //获取水表请求记录历史
    *getRequestList({ payload, callback }, { call, put }) {
      const response = yield call(queryRequestList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveRequestList',
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
    //请求远程水表操作
    *setMeterRequest({ payload, callback }, { call }) {
      const response = yield call(setMeterRequest, payload);
      if (response.msgCode === 0) {
        message.info('获取记录成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发水表的结算日期
    *settlementDate({ payload, callback }, { call }) {
      const response = yield call(meterSettlementDate, payload);
      if (response.msgCode === 0) {
        message.info('下发水表结算日期成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发标准时间
    *standardTime({ payload, callback }, { call }) {
      const response = yield call(meterStandardTime, payload);
      if (response.msgCode === 0) {
        message.info('下发水表标准时间成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发机电同步数据
    *syncData({ payload, callback }, { call }) {
      const response = yield call(meterSyncData, payload);
      if (response.msgCode === 0) {
        message.info('下发机电同步数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发上报时间
    *submissionTime({ payload, callback }, { call }) {
      const response = yield call(meterSubmissionTime, payload);
      if (response.msgCode === 0) {
        message.info('下发上报时间数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发控制阀门参数
    *valueControl({ payload, callback }, { call }) {
      const response = yield call(meterValueControl, payload);
      if (response.msgCode === 0) {
        message.info('下发控制阀门数据成功！');
        if (callback) callback();
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发IP地址
    *ipAddress({ payload, callback }, { call }) {
      const response = yield call(meterIpAddress, payload);
      if (response.msgCode === 0) {
        message.info('下发IP地址数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发告警参数
    *warnParameter({ payload, callback }, { call }) {
      const response = yield call(meterWarnParameter, payload);
      if (response.msgCode === 0) {
        message.info('下发告警参数数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发下线指令
    *offline({ payload, callback }, { call }) {
      const response = yield call(meterOffline, payload);
      if (response.msgCode === 0) {
        message.info('下发下线指令数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //重置水表余额
    *waterMeterBalance({ payload, callback }, { call }) {
      const response = yield call(meterBalance, payload);
      if (response.msgCode === 0) {
        message.info('重置水表余额数据成功！');
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发水表计费标准（阶梯水价）
    *waterMeterPrice({ payload, callback }, { call }) {
      const response = yield call(meterWaterPrice, payload);
      if (response.msgCode === 0) {
        message.info('下发水表阶梯水价成功！');
        if (callback) callback();
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //下发水表新地址
    *waterMeterAddress({ payload, callback }, { call }) {
      const response = yield call(meterWaterAddress, payload);
      if (response.msgCode === 0) {
        message.info('下发水表新地址成功！');
        if (callback) callback();
      } else if (response.msgCode === 2) {
        message.error(response.msg);
      } else {
        notification.error({
          message: '服务器异常',
          description: response.msg,
        });
      }
    },
    //校验水表账号唯一性
    *validMeterCode({ payload, callback }, { call }) {
      const response = yield call(validWaterMeterCode, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        if (callback) callback(response.msg);
      }
    },
    //校验IMEI唯一性
    *validIMEICode({ payload, callback }, { call }) {
      const response = yield call(validIMEICode, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        if (callback) callback(response.msg);
      }
    },
    // 批量创建水表
    *batchAddMeter({ payload, callback }, { call, put }) {
      const response = yield call(batchAddMeter, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        notification.error({
          message: '批量新增水表失败',
          description: response.msg,
        });
      }
    },
    // 批量设置时间
    *batchSetReportTime({ payload, callback }, { call, put }) {
      const response = yield call(batchSetReportTime, payload);
      if (response.msgCode === 0) {
        if (callback) callback();
      } else {
        notification.error({
          message: '批量设置上报时间失败',
          description: response.msg,
        });
      }
    },
    // 查看下发时间未成功的水表
    *findNotSetTimeMeter({ payload, callback }, { call, put }) {
      const response = yield call(findNotSetTimeMeter, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'setSetTimeResult',
          payload: response.data.code,
        });
      } else {
        notification.error({
          message: '获取未设置时间水表失败',
          description: response.msg,
        });
      }
    },
    // 上传IMEI号
    *uploadImeiList({ payload, callback }, { call, put }) {
      const response = yield call(uploadImeiList, payload);
      if (response.msgCode === 0) {
        message.success("上传IMEI成功");
        if (callback) callback();
      } else {
        notification.error({
          message: '上传IMEI号失败',
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
    setViewModalVisible(state, action) {
      return {
        ...state,
        viewModalVisible: action.payload,
      };
    },
    setRequestModalVisible(state, action) {
      return {
        ...state,
        requestModalVisible: action.payload,
      };
    },
    setAddModalVisible(state, action) {
      return {
        ...state,
        addModalVisible: action.payload,
      };
    },
    // 上传批量录入水表框
    setUploadModalVisible(state, action) {
      return {
        ...state,
        uploadModalVisible: action.payload,
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
    //保存搜索框内容
    setFormValues(state, action) {
      return {
        ...state,
        formValues: action.payload,
      };
    },
    saveRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    //存储操作信息
    saveOperateList(state, action) {
      return {
        ...state,
        operateList: action.payload,
      };
    },
    //存储请求信息
    saveRequestList(state, action) {
      return {
        ...state,
        requestList: action.payload,
      };
    },
    //暂存请求历史数据的水表Id
    setRequestHistoryRecord(state, action) {
      return {
        ...state,
        history: action.payload,
      };
    },
    // 设置是否正在上传
    setUploading(state, action) {
      return {
        ...state,
        uploading: action.payload,
      };
    },
    // 设置上传的文件列表
    setFileList(state, action) {
      return {
        ...state,
        fileList: action.payload,
      };
    },
    // 批量下发时间
    setSetTimeModalVisible(state, action) {
      return {
        ...state,
        setTimeModalVisible: action.payload,
      };
    },
    setSetTimeResult(state, action) {
      return {
        ...state,
        setTimeResult: action.payload,
      };
    },
    setNotSetTimeModalVisible(state, action) {
      return {
        ...state,
        notSetTimeModalVisible: action.payload,
      };
    },
    setUploadImeiModalVisible(state, action) {
      return {
        ...state,
        uploadImeiModalVisible: action.payload,
      };
    },
  },
};
