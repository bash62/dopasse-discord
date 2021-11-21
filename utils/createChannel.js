const { MessageEmbed } = require('discord.js');
const { CHANNEL_ID } = require('../config.json');
module.exports.createChannel = (interaction, firstTimeUser) => {

	interaction.guild.channels.create('Ticket-' + interaction.user.username, { type: 'text' }).then(async channel => {
		const category = interaction.message.guild.channels.cache.get(CHANNEL_ID.CHANNEL_TICKET);
		await channel.setParent(category);
		await channel.send(`<@${interaction.user.id}>`);
		let embed = new MessageEmbed();

		if (firstTimeUser) {

			embed = new MessageEmbed()
				.setTitle('Nous voyons que c\'est la première fois que vous ajouter une offre.')
				.setColor('#5e00ff')
				.setDescription('Veuillez renseigner les informations nécessaires pour pouvoir déposer une offre.');

			const filter = (message) => {
				return message.author.id === interaction.user.id;
			};

			const collector = channel.createMessageCollector({ filter, max: 2 });

			collector.on('collect', message => {
				console.log(message.content);

			});

		}
		else {

			embed = new MessageEmbed()
				.setTitle('Demande d\'aide en ')
				.setColor('#5e00ff')
				.setDescription('Tu peux poser ta question ou exposer ton problème ici.\n' +
					'Les autres pourront ainsi t\'aider le résoudre\n\n' +
					'Merci de respecter certaines règles :\n' +
					'   - Enonce clairement ton problème\n' +
					'   - Ajoute des morceaux de codes ou des images\n' +
					'   - Ferme la demande d\'aide une fois terminé en réagissant ci-dessous');
		}


		await channel.send({ embeds : [embed] });
		await interaction.reply({ content:' Your ticket have been created, follow for more instructions ' + '<#' + channel.id + '>', ephemeral:true });
	});
};