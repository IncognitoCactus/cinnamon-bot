const mongoose = require("mongoose");


const info = mongoose.Schema({
	userID: String,
	username: String,
	bio: String,
	friendCode: String
});

module.exports = mongoose.model("INFO", info)