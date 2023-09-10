const initialState = { visible: false, message: "", status: false };

export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ALERT": return { ...state, visible: true, message: action.payload.message, status: action.payload.status };
    case "REMOVE_ALERT": return { ...state, visible: false };
    default: return state;
  }
};

