export default {
  namespace: 'file',

  state: {
    fileList: [],
    imgIds: [],

    previewVisible: false, //是否预览
    previewImage: '', //预览图片
  },

  reducers: {
    setFileList(state, action) {
      return {
        ...state,
        fileList: action.payload,
      };
    },
    setImgIds(state, action) {
      return {
        ...state,
        imgIds: action.payload,
      };
    },
    setPreviewImage(state, action) {
      return {
        ...state,
        previewImage: action.payload,
      };
    },
    setVisible(state, action) {
      return {
        ...state,
        previewVisible: action.payload,
      };
    },
    cleanAll(state) {
      return {
        ...state,
        fileList: [],
        imgIds: [],
      };
    },
  },
};
