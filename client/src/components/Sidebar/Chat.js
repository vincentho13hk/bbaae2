import React from "react";
import { Badge, Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { selectActiveConversation } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  msgBadge: {
    marginRight: 17,
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.selectActiveConversation(
      conversation.otherUser,
      conversation.id
    );
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      <Box className={classes.msgBadge}>
        <Badge badgeContent={conversation.unread} color="primary" />
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectActiveConversation: (otherUser, conversationId) => {
      dispatch(selectActiveConversation(otherUser, conversationId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
