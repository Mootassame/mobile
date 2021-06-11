import * as actionTypes from './actionTypes';

const addImages = images => {
  return {
    type: actionTypes.ADD_IMAGES,
    images,
  };
};
const addVideo = video => {
  return {
    type: actionTypes.ADD_VIDEO,
    video,
  };
};
const addAudio = audio => {
  return {
    type: actionTypes.ADD_AUDIO,
    audio,
  };
};
const addFiles = files => {
  return {
    type: actionTypes.ADD_FILES,
    files,
  };
};
const resetMedia = () => {
  return {
    type: actionTypes.RESET_MEDIA,
  };
};
const removeFile = (index) => {
  return {
    type: actionTypes.REMOVE_FILE,
    index
  };
};
const removeImage = (index) => {
  return {
    type: actionTypes.REMOVE_IMAGE,
    index
  };
};
const currentUser = user_id => {
  return {
    type: actionTypes.CURRENT_USER,
    user_id
  };
};
const addToken = token => {
  return {
    type: actionTypes.TOKEN,
    token
  };
};
const signOut = () => {
  return {
    type: actionTypes.SIGN_OUT,
  };
};
const addTestimonyId = testimony_id => {
  return {
    type: actionTypes.TESTIMONY_ID,
    testimony_id
  };
};

export const onAddImages = images => dispatch => {
  dispatch(addImages(images));
};
export const onAddVideo = video => dispatch => {
  dispatch(addVideo(video));
};
export const onAddAudio = audio => dispatch => {
  dispatch(addAudio(audio));
};
export const onAddFiles = files => dispatch => {
  dispatch(addFiles(files));
};
export const onResetMedia = () => dispatch => {
  dispatch(resetMedia());
};
export const onRemoveFile = (fileIndex) => dispatch => {
  dispatch(removeFile(fileIndex));
};
export const onRemoveImage = (imageIndex) => dispatch => {
  dispatch(removeImage(imageIndex));
};
export const onCurrentUser = user_id => dispatch => {
  dispatch(currentUser(user_id));
};
export const onAddToken = token => dispatch => {
  dispatch(addToken(token));
};
export const onSignOut = () => dispatch => {
  dispatch(signOut());
};
export const onAddTestimonyId = testimony_id => dispatch => {
  dispatch(addTestimonyId(testimony_id));
};
