const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const GroupParticipant = require("./participant");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);

// Add for conversations that have more than two users
Conversation.hasMany(GroupParticipant);
GroupParticipant.belongsTo(Conversation);
User.hasMany(GroupParticipant);
GroupParticipant.belongsTo(User);

module.exports = {
  User,
  Conversation,
  Message,
};
