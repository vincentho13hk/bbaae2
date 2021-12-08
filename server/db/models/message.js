const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  read: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// toggle unread messages read status
Message.readUnreadMessages = async function (conversationId, userId) {
  const msgsRead = await Message.update(
    { read: "true" },
    {
      where: {
        senderId: {
          [Op.ne]: userId,
        },
        conversationId: {
          [Op.eq]: conversationId,
        },
      },
    }
  );

  // return update count
  return msgsRead;
};

module.exports = Message;
