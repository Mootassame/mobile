import * as actionTypes from './actionTypes';

const serchHistory = search => {
  return {
    type: actionTypes.ADD_HISTORY_SEARCH,
    search,
  };
};

const clearserchHistory = clear => {
  return {
    type: actionTypes.CLEAR_HISTORY_SEARCH,
    clear,
  };
};

export const onSearchHistory = search => dispatch => {
  dispatch(serchHistory(search));
};

export const onClearSearchHistory = clear => dispatch => {
  dispatch(clearserchHistory(clear));
};

