const { guildId, choixId, idMessage } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		//console.log(client);
		// A METTRE DANS LA RECUP DES EVENTS
		const guild = client.guilds.cache.get(guildId);
		const channel = guild.channels.cache.get(choixId);
		const msg = await channel.messages.fetch(idMessage);
		const embed = msg.embeds[0];
		embed.title = 'okded!';
		await msg.edit({ embeds:[embed] });
		console.log('rdy');
	},
};