import '../../services/personcenter/personCenter';
import { notification } from 'antd';
import {
  changeBindingPhone,
  addBankCard,
  checkSize,
  WithDraw,
  changeIsEffective,
  queryBankList,
  validCardNumber,
  sendCheckCode,
  sendCardCheckCode,
  compareCheckCode,
  compareCardCheckCode,
  changeWithDrawPwd,
} from '../../services/personcenter/personCenter';
export default {
  namespace: 'personCenter',

  state: {
    current: 0, // step的默认值
    phoneModalVisible: false, // 修改手机号弹窗是否显示
    changePwdModalVisible: false, // 修改密码弹窗是否显示
    addBankCardModalVisible: false, // 添加银行卡弹窗是否显示
    changeWithdrawPwdModalVisible: false, // 修改提现密码窗口
    withDrawModalVisible: false, // 提现弹窗是否显示
    bankList: [], // 银行卡集合
    bankCard: {}, // 添加的银行卡信息
    cardInfo: {}, // 根据银行卡号获取的银行卡信息
    isSend: false, // 是否已经发送验证码
    timer: 60, // 发送验证码倒计时
    checkCode: '', // 验证码
    cardIsSend: false, // 是否已经发送验证码
    cardTimer: 60, // 发送验证码倒计时
    cardPhone: '',
    phone: '',
  },
  effects: {
    // 比较验证码
    *compareCheckCode({ payload, callback }, { call, put }) {
      const response = yield call(compareCheckCode, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(true, response.msg);
        }
      } else if (response.msgCode == 3) {
        // 验证码过期
        if (callback) {
          callback(false, response.msg);
        }
      } else if (response.msgCode == 2) {
        // 验证码不对
        if (callback) {
          callback(false, response.msg);
        }
      } else {
        notification.error({
          message: '校验验证码异常',
          description: response.msg,
        });
      }
    },
    *compareCardCheckCode({ payload, callback }, { call, put }) {
      const response = yield call(compareCardCheckCode, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(true, response.msg);
        }
      } else if (response.msgCode == 3) {
        // 验证码过期
        if (callback) {
          callback(false, response.msg);
        }
      } else if (response.msgCode == 2) {
        // 验证码不对
        if (callback) {
          callback(false, response.msg);
        }
      } else {
        notification.error({
          message: '校验验证码异常',
          description: response.msg,
        });
      }
    },

    // 发送短信验证码
    *sendCheckCode({ payload, callback }, { call, put }) {
      const response = yield call(sendCheckCode, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(true, response.msg);
          yield put({
            type: 'saveCheckCode',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '发送短信验证码',
          description: response.msg,
        });
      }
    },

    *sendCardCheckCode({ payload, callback }, { call, put }) {
      const response = yield call(sendCardCheckCode, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(true, response.msg);
          yield put({
            type: 'saveCheckCode',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '发送短信验证码',
          description: response.msg,
        });
      }
    },

    // 更改绑定手机
    *changeBindingPhone({ payload, callback }, { call, put }) {
      const response = yield call(changeBindingPhone, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(true);
        }
      } else {
        notification.error({
          message: '更改绑定手机失败',
          description: response.msg,
        });
      }
    },
    // 查询绑定了的银行卡
    *queryBankList({ payload, callback }, { call, put }) {
      const response = yield call(queryBankList, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback(response.data);
        } else {
          yield put({
            type: 'saveBankList',
            payload: response.data,
          });
        }
      } else {
        notification.error({
          message: '查询绑定银行卡失败',
          description: response.msg,
        });
      }
    },
    *validCardNumber({ payload, callback }, { call, put }) {
      const response = yield call(validCardNumber, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveCardInfo',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        if (callback) callback(response.msg);
      }
    },
    // 添加银行卡
    *addBankCard({ payload, callback }, { call, put }) {
      const response = yield call(addBankCard, payload);
      if (response.msgCode == 0) {
        if (callback) callback(true);
      } else {
        notification.error({
          message: '绑定银行卡失败',
          description: response.msg,
        });
      }
    },
    // 校验输入的金额和余额大小
    *checkSize({ payload, callback }, { call, put }) {
      const response = yield call(checkSize, payload);
      if (response.msgCode == 1) {
        callback(response.msg);
      } else {
        callback();
      }
    },
    // 提现金额
    *withDraw({ payload, callback }, { call, put }) {
      const response = yield call(WithDraw, payload);
      if (response.msgCode == 0) {
        if (callback) callback(true);
      } else if (response.msgCode == 2) {
        // 等于2表示提现密码不对
        if (callback) callback(false);
      } else {
        notification.error({
          message: '提现失败',
          description: response.msg,
        });
      }
    },
    *changeWithDrawPwd({ payload, callback }, { call, put }) {
      const response = yield call(changeWithDrawPwd, payload);
      if (response.msgCode == 0) {
        if (callback) callback(true);
      } else {
        notification.error({
          message: '修改提现密码失败',
          description: response.msg,
        });
      }
    },
    *changeIsEffective({ payload, callback }, { call, put }) {
      const response = yield call(changeIsEffective, payload);
      if (response.msgCode == 0) {
        if (callback) callback(true);
      } else {
        notification.error({
          message: '修改银行卡失败',
          description: response.msg,
        });
      }
    },
  },

  reducers: {
    // 打开更改手机号的界面
    phoneModalVisible(state, action) {
      return {
        ...state,
        phoneModalVisible: action.payload,
      };
    },
    changePwdModalVisible(state, action) {
      return {
        ...state,
        changePwdModalVisible: action.payload,
        // changeWithdrawPwdModalVisible: action.payload,
      };
    },
    addBankCardModalVisible(state, action) {
      return {
        ...state,
        addBankCardModalVisible: action.payload,
      };
    },
    withDrawModalVisible(state, action) {
      return {
        ...state,
        withDrawModalVisible: action.payload,
      };
    },
    current(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    // 银行卡信息
    bankCard(state, action) {
      return {
        ...state,
        bankCard: action.payload,
      };
    },
    // 绑定了的银行卡
    saveBankList(state, action) {
      return {
        ...state,
        bankList: action.payload,
      };
    },
    saveCardInfo(state, action) {
      return {
        ...state,
        cardInfo: action.payload,
      };
    },
    // 表示已经发送验证码
    changeIsSend(state, action) {
      return {
        ...state,
        isSend: action.payload,
      };
    },
    // 倒计时
    setTimer(state, action) {
      return {
        ...state,
        timer: action.payload,
      };
    },
    // 验证码
    saveCheckCode(state, action) {
      return {
        ...state,
        checkCode: action.payload,
      };
    },
    changeCardIsSend(state, action) {
      return {
        ...state,
        cardIsSend: action.payload,
      };
    },
    setCardTimer(state, action) {
      return {
        ...state,
        cardTimer: action.payload,
      };
    },
    setCardPhone(state, action) {
      return {
        ...state,
        cardPhone: action.payload,
      };
    },
    setPhone(state, action) {
      return {
        ...state,
        phone: action.payload,
      };
    },
    openChangeWithdrawPwdModal(state, action) {
      return {
        ...state,
        changeWithdrawPwdModalVisible: action.payload,
      };
    },
  },
};
