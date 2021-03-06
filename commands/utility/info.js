const {Command} = require('discord.js-commando');
const request = require('request-promise');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber } = require('../../utils/miscUtils');


module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			group: 'utility',
			memberName: 'info',
			description: 'Bot information and credits',
			details: 'Bot information and credits',
			aliases: ['information','botinfo'],
			examples: ['info', 'botinfo'],
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
		});
	}

	async run(msg) {
		if (!msg.guild.members.has(msg.guild.ownerID)) await msg.guild.members.fetch(msg.guild.ownerID);
		const embed = new RichEmbed()
			.setColor(0x00AE86)
			.setThumbnail(this.client.user.avatarURL)
			.setAuthor('Hi! My name is Cinnamon!')
			.addField('Servers', formatNumber(this.client.guilds.size), true)
			.addField('Shards', formatNumber(this.client.options.shardCount), true)
			.addField('Commands', formatNumber(this.client.registry.commands.size), true)
			.addField('Source Code',`[Here](https://github.com/IncognitoCactus/cinnamon-bot/)`, true)
			.addField('Invite',`[Invite me to your server!](https://discordapp.com/oauth2/authorize?client_id=586652575307137024&scope=bot&permissions=8)`, true)
			.addField('Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('Uptime', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
			.addField('Version', `v0.0.1`, true)
			.addField('Node Version', process.version, true)
		return msg.embed(embed);
	}
};