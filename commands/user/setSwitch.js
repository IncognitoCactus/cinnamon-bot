const {Command} = require('discord.js-commando');
const path = require('path');

const Discord = require('discord.js')
const mongoose = require("mongoose")

let dbToken =""
if (process.env.database) {
	dbToken = process.env.database;
}
else {
	const secure = require('../../secure.json');
	dbToken = secure.database;
}

mongoose.connect(dbToken, {
	useNewUrlParser: true
});
const INFO = require("../../models/userinfo.js");

module.exports = class expCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setcode',
			group: 'user',
			memberName: 'setcode',
			description: 'Sets your user switch friend codes',
			details: 'Sets your user switch friend codes',
			aliases: ['setfc','sfc','sc'],
			examples: ['setcode [code]'],
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'code',
					prompt: 'Enter code',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, {code }) {
		//If user == author, allow them to set a new switch code.
		//friendcode set 438329374932
		//friendcode [user]
		if (code != '') {
            code = code.replace(/\D/g,'');
			if (code.length != 12) {
				msg.channel.send(msg.author + ", that's an invalid friend code! Friend codes are the 12 digits following 'SW' on your Switch profile.")
			}
			else {
				INFO.findOne({
					userID: msg.author.id
				}, (err, res) => {
					if (err) console.log(err);
                
					if (!res) {
						const newCode = new INFO({
							userID: msg.author.id,
							username: msg.author.username,
							friendCode: code
						})
						newCode.save().catch(err => console.log(err));
					} else {
						res.friendCode = code;
						res.save().catch(err => console.log(err));
						msg.channel.send(msg.author + ', your friend code was set to ' + code + "! Use 'c!fc' to view :)");
					}
				})
			}
		}

	}
};