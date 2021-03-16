export default {
  namespace: 'print',

  state: {
    payload: {
      formPrintData: [
        {
          number: 1,
          goodsName: 'sss',
          goodsType: 'dd',
          unitName: 'ss',
          specifications: 'we'
        }
      ]
    },
    formPrintData: [
      {
        number: 1,
        goodsName: 'sss',
        goodsType: 'dd',
        unitName: 'ss',
        specifications: 'we'
      }
    ]

  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
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
