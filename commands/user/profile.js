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
const LVL = require("../../models/level.js");

module.exports = class profileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'user',
			memberName: 'profile',
			description: 'Shows your profile',
			details: 'Shows your profile',
			examples: ['profile'],
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
		});
	}

	async run(message) {

		EXP.findOne({
			userID: message.author.id,
			serverID: message.guild.id
		}, (err, res) => {
			if (err) console.log(err);
            
			const embed = new Discord.RichEmbed()
				.setTitle(message.author.username + "'s User Profile")
				.setDescription("Tracks your activity in this server.")
				.setThumbnail(message.author.displayAvatarURL);
                
			if (!res) {
				embed.addField('You have no exp in this server :(')
			}
			else {
				embed.addField('EXP to Next Level',res.exp + " exp.")
			}
            
			//Level
			LVL.findOne({
				userID: message.author.id
			}, (err, res) => {
				if (err) console.log(err);
                    
				if (!res) {
					embed.addField('Level 0', "Talk some more to level up!")
				}
				else {
					embed.addField('Global Level',res.lvl)
				}

				message.channel.send(embed)
			})


		})
    
        

	}
};