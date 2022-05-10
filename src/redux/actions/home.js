import { SAVE_JSON_DATA } from "../actionTypes";

export const saveJson = (jsonData) => (dispatch, getState) => {
  dispatch({
    type: SAVE_JSON_DATA,
    jsonData,
  });
};
