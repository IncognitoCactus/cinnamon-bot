const mongoose = require("mongoose");

const lvlSchema = mongoose.Schema({
	userID: String,
	username: String,
	lvl: Number
});

module.exports = mongoose.model("LVL", lvlSchema)