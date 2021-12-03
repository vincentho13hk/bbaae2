import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { regexExpEmoji } from "../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  unread: {
    display: "flex",
    marginRight: 20,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewUnreadText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#000000",
    letterSpacing: -0.17,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
}));

// Change the text style by the read status
const getReadStatus = (conversation, otherUser) => {
  if (conversation.messages && conversation.messages.length > 0) {
    const lastMsg = conversation.messages.slice(-1)[0];
    const read = lastMsg.senderId === otherUser.id ? lastMsg.read : true;
    return read;
  } else {
    return true;
  }
};

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  const read = getReadStatus(conversation, otherUser);
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            read || regexExpEmoji.test(latestMessageText)
              ? classes.previewText
              : classes.previewUnreadText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
