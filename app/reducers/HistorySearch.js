import * as actionTypes from "@actions/actionTypes";
const initialState = {
 HistorySearch:[]
};

const HistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HISTORY_SEARCH:
      case actionTypes.HISTORY_SEARCH:
        return { ...state, HistorySearch: state.HistorySearch.concat(search) };
       default:
      return state;
  }
};

export default HistoryReducer;