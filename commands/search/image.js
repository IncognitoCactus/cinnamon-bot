const {Command} = require('discord.js-commando');
const request = require('request-promise');

module.exports = class ImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'image',
			group: 'search',
			memberName: 'image',
			description: 'Searches for an image. SFW results only.',
			details: 'Searches for an image. SFW results only.',
			aliases: ['img'],
			examples: ['img kodak black', 'img weeb stuff'],
			format: '[query]',
			guildOnly: false,
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { query }) {
		if (msg.member.currentSearch && !msg.member.currentSearch.ended) msg.member.currentSearch.stop();
		const sayResult = async (data, del) => {
			if (del) del.delete();
			let lastImage;
			try {
				lastImage = await msg.say('Type "next" for the next search result.', {embed: {
					title: `Image result for "${query}"`,
					color: 0x4885ED,
					image: {
						url: data.splice(0, 1)[0].link,
					},
				}});
			} catch (e) {
				return msg.say('There are no more results for this search.');
			}
			// eslint-disable-next-line require-atomic-updates
			msg.member.currentSearch = msg.channel.createMessageCollector((m) => m.author.id == msg.author.id && m.channel.id == msg.channel.id && m.content.toLowerCase() == 'next', {time: 30000, maxMatches: 1});
			msg.member.currentSearch.on('collect', () => sayResult(data, lastImage));
			return;
		};

		request({
			uri: `https://www.googleapis.com/customsearch/v1?searchType=image&cx=017119602772521781611:_sy6ezmcc90&key=${process.env.imageSearchAPIKey}&safe=medium&q=${query}`,
			json: true,
			headers: {
				'User-Agent': 'Cinnamon Bot',
			},
		}).then((d) => {
			sayResult(d.items);
		}).catch((e) => {
			console.log(e);
			return msg.say('Something went wrong with this search.').catch(() => {});
		});
	}
};