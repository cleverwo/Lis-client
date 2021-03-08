export default {
  namespace: 'vendorSearchInput',

  state: {
    current: {}, //记录下拉框选中的值
    timeout: null, //记录setTimeout返回的id标识
  },

  reducers: {
    current(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    timeout(state, action) {
      return {
        ...state,
        timeout: action.payload,
      };
    },
    clear(state, action) {
      return {
        ...state,
        timeout: null,
        current: {},
      };
    },
  },
};
