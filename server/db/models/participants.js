const Sequelize = require("sequelize");
const db = require("../db");

const GroupParticipant = db.define("participant", {});

module.exports = GroupParticipant;
