const {Command} = require('discord.js-commando');
const Canvas = require('canvas');
const path = require('path');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'flirting',
			group: 'fun',
			memberName: 'flirting',
			description: 'Shows you a user\'s flirting power.',
			details: 'Shows you a user\'s flirting power.',
			examples: ['flirting @user message'],
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'victim',
					label: "victim",
					prompt: 'Which user would you like to see flirting?',
					type: 'user'
				},
				{
					key: 'input',
					prompt: 'Message to flirt with',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { victim, input }) {

		function wrapText(context, text, x, y, maxWidth, lineHeight) {
			var words = text.split(' ');
			var line = '';
    
			for(var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}
			context.fillText(line, x, y);
		}

	

		// Set a new canvas to the dimensions of 700x300 pixels
		const canvas = Canvas.createCanvas(720, 806);
		const ctx = canvas.getContext('2d');
        
		//Set white background
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.fill();
        
		//Load avatars
		const avatar = await Canvas.loadImage(victim.displayAvatarURL);

        
		//Load and draw background
		const bg = await Canvas.loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'flirting.png'));
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        
		//Draw avatars
		ctx.drawImage(avatar, 385, 180, 60, 60);
		ctx.drawImage(avatar, 625, 219, 75, 75);
		ctx.drawImage(avatar, 85, 560, 145, 145);
        
		//Draw username
		if(victim.username.length < 6) {
			ctx.font = 'bold 20px sans-serif';
			ctx.textAlign = "left"; 
			ctx.fillStyle = '#000000';
			ctx.fillText(victim.username +"!", 280, 353);
		}
		else if(victim.username.length < 9) {
			ctx.font = 'bold 14px sans-serif';
			ctx.textAlign = "left"; 
			ctx.fillStyle = '#000000';
			ctx.fillText(victim.username +"!", 280, 353);
		}
		else {
			ctx.font = 'bold 20px sans-serif';
			ctx.textAlign = "left"; 
			ctx.fillStyle = '#000000';
			ctx.fillText("Hey!", 280, 353);
		}
        
		//Draw message
		if(input.length < 23) {
			ctx.font = 'bold 20px sans-serif';
			ctx.textAlign = "center"; 
			ctx.fillStyle = '#ffffff';
			ctx.fillText(input, 125, 480);
		}
		else {

			var lineHeight = 25;
			if (input.length < 96) {
				ctx.font = 'bold 20px sans-serif';
				lineHeight = 25;
			}
			else {
				ctx.font = 'bold 15px sans-serif';
				lineHeight = 15;
			}
			ctx.textAlign = "center"; 
			ctx.fillStyle = '#ffffff';

			var context = canvas.getContext('2d');
			var maxWidth = 220;
			wrapText(context, input, 125, 425, maxWidth, lineHeight);
		}


		const reaction = "Smooth, " + msg.author + ".";

		//Display
		return msg.say(reaction,{ files: [{ attachment: canvas.toBuffer(), name: 'flirting.png' }] });
	}
};