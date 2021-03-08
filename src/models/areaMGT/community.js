import {message, notification} from "antd";
import {
  addRecord,
  deleteBlock,
  insertBlock, patchBlock, queryBlockList, queryCommunityList,
  queryList,
  removeRecord,
  updateRecord
} from "../../services/areaMGT/community";

export default {
  namespace: 'community',
  //区域参数
  state: {
    data: {
      list: [],
      pagination: {}
    },
    record: {},
    //楼栋参数
    blockList: [],
    recordId: {},
    isUpdate: true,
    //五级联动列表
    communityList: [],
  },

  effects: {
    //获取区域列表
    * fetch({payload}, {call, put}) {
      const response = yield call(queryList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '查询区域列表失败',
          description: response.msg,
        });
      }
    },
    //新增区域信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addRecord, payload);
      if (response.msgCode === 0) {
        message.success('新增成功');
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
    //删除区域信息
    *remove({callback,payload},{call}){
      const response = yield call(removeRecord, payload);
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
    //更新区域信息
    *update({ payload, callback }, { call }) {
      const response = yield call(updateRecord, payload);
      if (response.msgCode === 0) {
        message.success('更新信息成功');
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
    //获取楼栋列表 根据communityID
    *fetchBlockList({ payload, callback }, { call, put }) {
      const response = yield call(queryBlockList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'applyNewData',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '查询楼栋信息失败',
          description: response.msg,
        });
      }
    },
    //删除楼栋
    *removeBlock({ payload, callback }, { call, put }) {
      if (undefined === payload.id || 'NEWID' === payload.id) {
        yield put({
          type: 'deleteBlockList',
        });
      } else {
        const response = yield call(deleteBlock, payload.id);
        if (response.msgCode === 0) {
          message.success('删除成功');
          yield put({
            type: 'deleteBlockList',
            payload: payload.id,
          });
          if (callback) callback();
        } else {
          message.error(response.msg);
        }
      }
    },
    //添加楼栋
    *addBlock({ payload, callback }, { call, put }) {
      const response = yield call(insertBlock, payload);
      if (response.msgCode === 0) {
        message.success('添加成功');
        yield put({
          type: 'addNewBlock',
          payload: response.data,
        });
        if (callback) callback(true);
      } else {
        message.error(response.msg);
      }
    },
    //更新楼栋
    *updateBlock({ payload, callback }, { call }) {
      const response = yield call(patchBlock, payload);
      if (response.msgCode === 0) {
        message.success('更新成功');
        if (callback) callback(true);
      } else {
        message.error(response.msg);
      }
    },
    //获取五级联动列表
    *fetchCommunityList({ payload, callback }, { call, put }) {
      const response = yield call(queryCommunityList, payload);
      if (response.msgCode === 0) {
        yield put({
          type: 'saveCommunityList',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '查询列表信息失败',
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
    saveRecord(state, action){
      return {
        ...state,
        record: action.payload,
      };
    },

    //用于更新整个孩子列表
    applyNewData(state, action) {
      return {
        ...state,
        blockList: action.payload,
      };
    },
    //删除一个孩子
    deleteBlockList(state, action) {
      const oldData = state.blockList;
      let newData = [];
      if (action.payload) {
        newData = oldData.filter(item => item.id !== action.payload);
      } else {
        newData = oldData.filter(item => !item.isNew);
      }
      return {
        ...state,
        blockList: newData,
      };
    },

    //用于添加一条货道，将服务器返回的新增数据插进货道列表
    addNewBlock(state, action) {
      const oldData = state.blockList;
      //过滤掉本地添加的数据
      const alterFlilter = oldData.filter(item => undefined === item.isNew);
      //添加服务器返回的数据
      alterFlilter.push(action.payload);
      return {
        ...state,
        blockList: alterFlilter,
      };
    },

    setRecordId(state,action) {
      return {
        ...state,
        recordId: action.payload,
      };
    },

    saveCommunityList(state,action){
      return {
        ...state,
        communityList: action.payload,
      };
    },

  }
}
