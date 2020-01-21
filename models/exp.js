const mongoose = require("mongoose");

const expSchema = mongoose.Schema({
	userID: String,
	username: String,
	serverID: String,
	exp: Number
});

module.exports = mongoose.model("EXP", expSchema)