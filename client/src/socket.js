import io from "socket.io-client";
import store from "./store";
import { removeOfflineUser, addOnlineUser } from "./store/conversations";

import {
  getNewMessage,
  latestMessageIsRead,
} from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    if (data.recipientId === store.getState().user.id) {
      store.dispatch(getNewMessage(data));
    }
  });
  socket.on("read-latest-message", (data) => {
    if (data.userId === store.getState().user.id) {
      store.dispatch(latestMessageIsRead(data.conversationId, data.userId));
    }
  });
});

export default socket;
