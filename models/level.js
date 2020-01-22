const mongoose = require("mongoose");

const lvlSchema = mongoose.Schema({
	userID: String,
	username: String,
	lvl: Number
});

const ServerLvlSchema = mongoose.Schema({
	userID: String,
	username: String,
	serverID: String,
	lvl: Number
});

module.exports = mongoose.model("LVL", lvlSchema)
module.exports = mongoose.model("SRVLVL", ServerLvlSchema)