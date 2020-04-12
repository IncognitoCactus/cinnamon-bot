const mongoose = require("mongoose");


const info = mongoose.Schema({
	userID: String,
	username: String,
	serverID: String,
	bio: String,
	friendCode: String
});

module.exports = mongoose.model("INFO", info)