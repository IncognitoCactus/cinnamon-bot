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
const EXP = require("../../models/exp.js");

module.exports = class expCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exp',
			group: 'user',
			memberName: 'exp',
			description: 'Shows your exp',
			details: 'Shows your exp',
			examples: ['exp'],
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
		});
	}

	async run(message) {

		const embed = new Discord.RichEmbed()
			.setTitle(message.author.username + "'s experience")
			.setDescription("Experience is gained through activity! EXP is per-server, but your level is global!")
			.setThumbnail(message.author.displayAvatarURL);

		EXP.findOne({
			userID: message.author.id,
			serverID: message.guild.id
		}, (err, res) => {
			if (err) console.log(err);
        
			if (!res) {
				embed.setColor("RED");
				embed.addField("Error", "Sorry, you don't have any exp in this server...");
			} else {
				embed.setColor("BLURPLE");
				embed.addField(res.username, res.exp + " exp.");
			}
        
			message.channel.send(embed)
        
		})
	}
};