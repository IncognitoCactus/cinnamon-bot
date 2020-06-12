const {Command} = require('discord.js-commando');
const request = require('request-promise');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const mcdonald = 'mcdonald'.split('')
const mcchicken = 'mcchicken'.split('')

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'al',
			group: 'fun',
			memberName: 'al',
			description: 'Finally. What I\'ve been waiting for.',
			details: 'Finally. What I\'ve been waiting for.',
			guildOnly: false,
			throttling: {
				usages: 2,
				duration: 10
			},
		});
	}
    
	async run(msg) {
    shuffle(mcdonald)
    shuffle(mcchicken)
		return msg.say('At last, ' +  mcdonald.join('') + ' ' + mcchicken.join(''));
	}
}
