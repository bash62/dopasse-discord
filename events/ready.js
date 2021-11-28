const { guildId, CHANNEL_ID, MESSAGES_ID } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		// A METTRE DANS LA RECUP DES EVENTS
		const guild = client.guilds.cache.get(guildId);
		const channel = guild.channels.cache.get(CHANNEL_ID.CHANNEL_CHOICES);
		const msg = await channel.messages.fetch(MESSAGES_ID.SERVEUR_CHOICES);
		const embed = msg.embeds[0];
		embed.setTimestamp();
		await msg.edit({ embeds:[embed] });
		console.log('rdy');
	},
};