import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  messagesGetRead,
  updateUnread,
  readMessages,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";
import { setActiveChat } from "../activeConversation";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const updateMessagesToRead = async (conversationId) => {
  const { data } = await axios.patch("/api/messages/read", { conversationId });
  return data;
};

export const getNewMessage = (msgData) => async (dispatch, getState) => {
  try {
    const senderId = msgData.message.senderId;
    dispatch(setNewMessage(msgData.message, msgData.sender));
    const activeUserId = getState().activeConversation.id;
    if (!activeUserId || activeUserId !== senderId) {
      dispatch(updateUnread(msgData.message.senderId, activeUserId));
    } else {
      // update to read for active Convo
      const conversation = getState().conversations.find(
        (convo) => convo.otherUser.id
      );
      if (conversation.id) {
        await updateMessagesToRead(conversation.id);
        socket.emit("read-latest-message", {
          conversationId: conversation.id,
          userId: senderId,
        });
        await updateMessagesToRead(conversation.id);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const latestMessageIsRead =
  (conversationId, userId) => async (dispatch) => {
    // if(!setState().conversations.find(convo=>convo.id===conversationId)){
    //   dispatch(addConversation)
    // }
    dispatch(messagesGetRead(conversationId, userId));
  };

export const selectActiveConversation =
  (otherUser, conversationId) => async (dispatch) => {
    try {
      dispatch(setActiveChat(otherUser));
      dispatch(readMessages(conversationId, otherUser.id));
      await updateMessagesToRead(conversationId);
      socket.emit("read-latest-message", {
        conversationId,
        userId: otherUser.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);
    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
