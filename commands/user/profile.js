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
				embed.addField('You have no exp in this server :(','Talk some more!!')
			}
			else {
				embed.addField('EXP to Next Level',res.exp + " exp.")
			}
            
			//Level
			LVL.findOne({
				userID: user.id
			}, (err, res) => {
				if (err) console.log(err);
                    
				if (!res) {
					embed.addField('Level 0', "Talk some more to level up!")
				}
				else {
					embed.addField('Global Level',res.lvl)
				}

				msg.channel.send(embed)
			})


		})
    
        

	}
};