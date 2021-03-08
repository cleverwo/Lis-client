import {
  queryUnReadNotice,
  sendedNotices,
  sendedNotice,
  receivedNotices,
  receivedNotice,
  createNotice,
  updateNotice,
  listType,
  userTree,
} from '../../services/personcenter/notice';
import { Sended, Received } from './noticeType';
import { notification } from 'antd';

export default {
  namespace: 'notice',

  state: {
    unreadNotices: [], //未读消息列表
    notices: {
      list: [],
      pagination: {},
    }, //消息列表，带分页信息

    expandSearchForm: false, //是否展开查询条件
    searchFormValues: {}, //查询条件

    userTree: [], //角色-用户 树状结构信息
    selectedUsers: [], //多选框选中的用户，也可能是上一层的角色，跟组件有关系
    selectedUserIds: [], //多选框选中的用户ID

    createModalVisible: false, //是否显示创建弹窗

    viewModalVisible: false, //是否显示查看弹窗
    viewModalData: {}, //查看弹窗内容

    type: [], //所有消息类型
    scope: Received, //消息种类，  收到的RECEIVED/发送的SENDED
  },

  effects: {
    *fetchUnReadNotices(_, { call, put }) {
      const response = yield call(queryUnReadNotice);
      if (response.msgCode == 0) {
        yield put({
          type: 'unreadNotices',
          payload: response.data,
        });
        yield put({
          type: 'user/changeNotifyCount',
          payload: response.data.length,
        });
      } else {
        notification.error({
          message: '获取未读消息失败',
          description: response.msg,
        });
      }
    },
    *sendedNotices({ payload, callback }, { call, put }) {
      const response = yield call(sendedNotices, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'notices',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
        notification.error({
          message: '获取消息失败',
          description: response.msg,
        });
      }
    },
    *receivedNotices({ payload, callback }, { call, put }) {
      const response = yield call(receivedNotices, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'notices',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
        notification.error({
          message: '获取消息失败',
          description: response.msg,
        });
      }
    },
    *sendedNotice({ payload, callback }, { call, put }) {
      const response = yield call(sendedNotice, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'viewModalData',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
        notification.error({
          message: '获取消息失败',
          description: response.msg,
        });
      }
    },
    *receivedNotice({ payload, callback }, { call, put }) {
      const response = yield call(receivedNotice, payload);
      if (response.msgCode == 0) {
        yield put({
          type: 'viewModalData',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
        notification.error({
          message: '获取消息失败',
          description: response.msg,
        });
      }
    },
    *fetchNoticeType(_, { call, put }) {
      const response = yield call(listType);
      if (response.msgCode == 0) {
        yield put({
          type: 'type',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取消息类型失败',
          description: response.msg,
        });
      }
    },
    *fetchUserTree(_, { call, put }) {
      const response = yield call(userTree);
      if (response.msgCode == 0) {
        yield put({
          type: 'userTree',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '获取用户树形结构失败',
          description: response.msg,
        });
      }
    },
    *createNotice({ payload, callback }, { call, put }) {
      const response = yield call(createNotice, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '新增消息失败',
          description: response.msg,
        });
      }
    },
    *updateNotice({ payload, callback }, { call, put }) {
      const response = yield call(updateNotice, payload);
      if (response.msgCode == 0) {
        if (callback) {
          callback();
        }
      } else {
        notification.error({
          message: '更新消息已读状态失败',
          description: response.msg,
        });
      }
    },
    //TODO:清除消息没意义似乎，后面改成全部标位已读的功能
    *clearUnReadNotices({ payload }, { put, select }) {
      console.log(payload);
      yield put({
        type: 'saveClearedUnReadNotices',
        payload,
      });
      const count = yield select(state => state.notice.unreadNotices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    unreadNotices(state, { payload }) {
      return {
        ...state,
        unreadNotices: payload,
      };
    },
    notices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedUnReadNotices(state, { payload }) {
      return {
        ...state,
        unreadNotices: state.unreadNotices.filter(item => item.type !== payload),
      };
    },

    expandSearchForm(state, { payload }) {
      return {
        ...state,
        expandSearchForm: payload,
      };
    },
    searchFormValues(state, { payload }) {
      return {
        ...state,
        searchFormValues: payload,
      };
    },

    userTree(state, { payload }) {
      return {
        ...state,
        userTree: payload,
      };
    },
    selectedUsers(state, { payload }) {
      return {
        ...state,
        selectedUsers: payload,
      };
    },
    selectedUserIds(state, { payload }) {
      return {
        ...state,
        selectedUserIds: payload,
      };
    },

    createModalVisible(state, { payload }) {
      return {
        ...state,
        createModalVisible: payload,
      };
    },

    viewModalVisible(state, { payload }) {
      return {
        ...state,
        viewModalVisible: payload,
      };
    },
    viewModalData(state, { payload }) {
      return {
        ...state,
        viewModalData: payload,
      };
    },

    type(state, { payload }) {
      return {
        ...state,
        type: payload,
      };
    },
    scope(state, { payload }) {
      return {
        ...state,
        scope: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
