import * as actionTypes from '@actions/actionTypes';
const initialState = {
  images: [],
  video: null,
  audio: null,
  files: [],
  user_id: null,
  token: '',
  testimony_id: null
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_IMAGES:
      return {
        ...state,
        images: action.images,
      };
    case actionTypes.ADD_VIDEO:
      return {
        ...state,
        video: action.video,
      };
    case actionTypes.ADD_AUDIO:
      return {
        ...state,
        audio: action.audio,
      };
    case actionTypes.ADD_FILES:
      return {
        ...state,
        files: action.files,
      };
    case actionTypes.RESET_MEDIA:
      return {
        ...state,
        images: [],
        video: null,
        audio: null,
        files: [],
      };
    case actionTypes.REMOVE_FILE:
      const fileIndex = action.fileIndex;
      const updatedFiles = [...state.files];
      updatedFiles.splice(fileIndex, 1);
      return {
        ...state,
        files: updatedFiles
      };
    case actionTypes.REMOVE_IMAGE:
      const imageIndex = action.imageIndex;
      const updatedImages = [...state.images];
      updatedImages.splice(imageIndex, 1);
      return {
        ...state,
        images: updatedImages,
      };
    case actionTypes.CURRENT_USER:
      return {
        ...state,
        user_id: action.user_id,
      };
    case actionTypes.TOKEN:
      return {
        ...state,
        token: action.token
      };
    case actionTypes.SIGN_OUT:
      return {
        ...state,
        token: '',
        user_id: null,
        testimony_id: null
      };
    case actionTypes.TESTIMONY_ID:
      return {
        ...state,
        testimony_id: action.testimony_id
      };
    default:
      return state;
  }
};
