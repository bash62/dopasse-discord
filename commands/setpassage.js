const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { LOGO, ROLES_ID } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setoffer')
		.setDescription('Init passage offer embed message'),
	async execute(interaction) {

		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Renseigner une nouvelle offre de passage.')
			.setThumbnail(LOGO.URL_DOFUS_SUCCES)
			.setDescription('Appuyer sur le bouton pour commencer.');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('button_passage')
					.setLabel('Je propose un passage.')
					.setStyle('SUCCESS'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('button_kit')
					.setLabel('Je propose un kit.')
					.setStyle('SUCCESS'),
			);

		await interaction.channel.send({ embeds: [exampleEmbed], components: [row] });
	},
};
