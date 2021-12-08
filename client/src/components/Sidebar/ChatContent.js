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

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            conversation.unread === 0 || regexExpEmoji.test(latestMessageText)
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
