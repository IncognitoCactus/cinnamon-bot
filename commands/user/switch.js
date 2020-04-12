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
			name: 'switchcode',
			group: 'user',
			memberName: 'switchcode',
			description: 'Shows user switch friend codes',
			details: 'Shows user switch friend codes',
			aliases: ['friendcode','fc','switch'],
			examples: ['switchcode [user]'],
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'user',
					prompt: 'Choose a user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user}) {
		//If user == author, allow them to set a new switch code.
		//friendcode set 438329374932
		//friendcode [user]
		
		const embed = new Discord.RichEmbed()
			.setTitle(user.username + "'s Switch friend code")
			.setDescription("You can use this code to add " + user.username + " as a friend on the Nintendo Switch!")
			.setThumbnail(user.displayAvatarURL);
            
		INFO.findOne({
			userID: user.id,
			serverID: msg.guild.id
		}, (err, res) => {
			if (err) console.log(err);
            
			if (!res) {
				embed.setColor("RED");
				    embed.addField("Error", "Sorry, this user has not set their friend code. Use 'switchcode [you] [code]' to set your own!");
			} else {
				embed.setColor("BLURPLE");
				    embed.addField(res.username + "'s code:", res.friendCode);
			}
			msg.channel.send(embed)

		})

	}
};