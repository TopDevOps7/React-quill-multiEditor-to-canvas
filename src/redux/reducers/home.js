import { SAVE_JSON_DATA } from "../actionTypes";

const initialState = {
  jsonData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_JSON_DATA: {
      let jsonData = state.jsonData;
      jsonData = action.jsonData;
      return {
        ...state,
        jsonData,
      };
    }
    default:
      return state;
  }
}
