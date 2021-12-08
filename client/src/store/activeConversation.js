const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (user) => {
  return {
    type: SET_ACTIVE_CHAT,
    user,
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.user;
    }
    default:
      return state;
  }
};

export default reducer;
