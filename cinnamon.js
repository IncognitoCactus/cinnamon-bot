//Using sqlite as database
const sqlite = require('sqlite');
const Commando = require('discord.js-commando');
const path = require('path');
const { formatNumber } = require('./utils/miscUtils.js');
// eslint-disable-next-line no-global-assign
console = new (require('./utils/advancedConsole'))(0, console.log);
//Version number for playing status
var versionNum = 'v0.0.1';

const Cinnamon = new Commando.Client({
	owner: ['87723984799399936', '147604925612818432'],
	commandPrefix: 'c!',
	unknownCommandResponse: false,
	disableEveryone: true,
});

//Define looping statuses
const statuses = [Cinnamon.commandPrefix + `help`, `We're gonna be good friends :)`, `:D`, `Try ` + Cinnamon.commandPrefix + `ship`, `Hi, you're cool`]

//screw sql, mongo is the future

let dbToken = ""
if (process.env.database) {
	dbToken = process.env.database;
}
else {
	const secure = require('./secure.json');
	dbToken = secure.database;
}
const mongoose = require("mongoose");
mongoose.connect(dbToken, {
	useNewUrlParser: true
});

const EXP = require("./models/exp.js");
const LVL = require("./models/level.js")


Cinnamon.registry
	.registerGroups([
		['search', 'Search commands'],
		['fun', 'Fun commands'],
		['user', 'Profile and user commands'],
		['utility', 'Utility commands'],
		['roleplay', 'Roleplay commands'],
		['owner', 'Owner-only commands']
	])
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

Cinnamon.on('ready', () => {
	console.log('Bot successfully started.');
	//Set custom status for local testing
	if(!process.env.BOT_TOKEN) Cinnamon.user.setActivity('Testing!');
	//Change status every 5 minutes.
	else {
		setInterval(() => {
			const status = statuses[Math.floor(Math.random()*statuses.length)]
			Cinnamon.user.setActivity(status + ' | ' + versionNum);
		}, 300000);
	}
});

//Send hello upon joining server
Cinnamon.on("guildCreate", guild => {
	let channelID;
	const channels = guild.channels;
	//Search for first available text channel
	channelLoop:
	for (const c of channels) {
		const channelType = c[1].type;
		if (channelType === "text") {
			channelID = c[0];
			break channelLoop;
		}
	}
	//Send a hello message
	const channel = Cinnamon.channels.get(guild.systemChannelID || channelID);
	channel.send("Hi! My name is Cinnamon and we're gonna be good friends!\nCheck out my commands with "+Cinnamon.commandPrefix+"help or feel free to dm me :)");
});


Cinnamon.on("message", async message => {
	//Bots don't earn exp
	if (message.author.bot) return;

	const chance = Math.floor(Math.random() * 70) + 1;
	if (chance > 50) {
	//here is where the exp are added.

		const exptoadd = Math.ceil(Math.random() * 10);

		EXP.findOne({
			userID: message.author.id,
			serverID: message.guild.id
		}, (err, res) => {
			if(err) console.log(err);

			if(!res){
				const newDoc = new EXP({
					userID: message.author.id,
					username: message.author.username,
					serverID: message.guild.id,
					exp: exptoadd
				})
				newDoc.save().catch(err => console.log(err));
			} else{
				//If XP >= 100, add one to level
				if(res.exp >= 100) {
					res.exp = 0;
					LVL.findOne({
						userID: message.author.id
					}, (err, res) => {
						//If level 0, create doc for user and set level = 1
						if(!res){
							const newDoc = new LVL({
								userID: message.author.id,
								username: message.author.username,
								lvl: 1
							})
							newDoc.save().catch(err => console.log(err));
						}
						else {
							res.lvl += 1;
							res.save().catch(err => console.log(err))
						}
					})
				}
				res.exp = res.exp + exptoadd;
				res.save().catch(err => console.log(err))
			}
		})
	}
});

// Checks if there's a bot token from Heroku
if (process.env.BOT_TOKEN) Cinnamon.login(process.env.BOT_TOKEN);
// Otherwise, assumes local testing configuration and loads token from secure
else {
	const secure = require('./secure.json');
	Cinnamon.login(secure.discordAPIKey);
}
