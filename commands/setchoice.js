const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { LOGO, ROLES_ID } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setchoice')
		.setDescription('Create server choice selector'),
	async execute(interaction) {

		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Le passage sur dofus 2.0')
			.setURL('https://discord.gg/SqrMVPzB')
			//.setAuthor('Dofus passage', logoUrl, 'https://discord.gg/SqrMVPzB')
			.setDescription('Le meilleur discord de passeur.')
			.setThumbnail(LOGO.URL_DOFUS_GLACE)
			.addFields(
				{ name: 'Passeur actif :', value: '1' },
				{ name: 'Clients actif :', value: '0' },
				{ name: 'Succès proposé :', value: '8' },
				{ name: 'Passeur le mieux noté : ', value: 'Senkei' },
			)

			.setImage(LOGO.URL_DOFUS_GLACE)
			.setTimestamp()
			.setFooter('Last update:', LOGO.URL_DOFUS_GLACE);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(ROLES_ID.ILLYZAELLE)
					.setLabel('Illyzaelle')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(ROLES_ID.JAHASH)
					.setLabel('Jahash')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(ROLES_ID.INTERSERVEUR)
					.setLabel('Interserveur')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('reset')
					.setLabel('RESET')
					.setStyle('DANGER'),
			);
		await interaction.channel.send({ embeds: [exampleEmbed], components: [row] });
	},
};
