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
const SRVLVL = require("../../models/level.js");
const INFO = require("../../models/userinfo.js")

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
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get the profile of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {

		EXP.findOne({
			userID: user.id,
			serverID: msg.guild.id
		}, (err, res) => {
			if (err) console.log(err);
            
			const embed = new Discord.RichEmbed()
				.setTitle(user.username + "'s User Profile")
				.setDescription("Tracks your activity in this server.")
				.setThumbnail(user.displayAvatarURL);
                
			if (!res) {
				embed.addField('EXP Towards Next Level','You have no exp in this server :(')
			}
			else {
				embed.addField('EXP Towards Next Level',res.exp + " xp")
			}
            
			//Level
			LVL.findOne({
				userID: user.id
			}, (err, res) => {
				if (err) console.log(err);
                    
				if (!res) {
					embed.addField('Global Level', "0 - Talk some more!",true)
				}
				else {
					embed.addField('Global Level','Level ' + res.lvl,true)
				}
				//Level
				SRVLVL.findOne({
					userID: user.id,
					serverID: msg.guild.id
				}, (err, res) => {
					if (err) console.log(err);
						
					if (!res) {
						embed.addField('Server Level', "0 - Talk some more!",true)
					}
					else {
						embed.addField('Server Level','Level ' + res.lvl,true)
					}

					//Info
					INFO.findOne({
						userID: user.id
					}, (err, res) => {
						if (err) console.log(err);
                    
						if (!res) {
							embed.addField('Info', "No info available :(")
						}
						else {
							if(res.friendCode) {
								embed.addField('Switch Friend Code',res.friendCode)
							}
						}
						msg.channel.send(embed)
					})

					
				})
			})

		})
    
        

	}
};