const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { logoUrl, interserveurRole, illyzaelleRole, jahashRoles } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setchoice')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {

		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Dofus passage, sales and help.')
			.setURL('https://discord.gg/SqrMVPzB')
			.setAuthor('Dofus passage', logoUrl, 'https://discord.gg/SqrMVPzB')
			.setDescription('This discord is really good.')
			.setThumbnail(logoUrl)
			.addFields(
				{ name: 'Helpers :', value: '1' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Seekers :', value: 'Some valuea', inline: true },
				{ name: 'Dunjon covered :', value: 'Some value here', inline: true },
			)
			.addField('Top tier helpers :', 'Senkei\nmax', true)
			.setImage(logoUrl)
			.setTimestamp()
			.setFooter('Last update:', logoUrl);

			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(interserveurRole)
					.setLabel('Interserveur')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(illyzaelleRole)
					.setLabel('Illyzaelle')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId(jahashRoles)
					.setLabel('Jahash')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('reset')
					.setLabel('RESET')
					.setStyle('DANGER'),
			);


		// const embed = new MessageEmbed()
		// 	.setColor('#e62643')
		// 	.setTitle('Choisi tes roles ! ')
		// 	.setDescription('@everyone\n\n'
        //     + '> Le but de ce discord est d\'automatiser les passages sur dofus. Vous pouvez vous enregister en tant que passeur  :passeur: ( Donjons, avis, quête... )  ou en tant que client  :shiba: '
        //     + '\n__**Pour commencer, choisissez votre serveur et votre role en cliquant sur l\'émoticône correspondante sous ce message : **__' +
        //     +':interserveur: ➔ `Interserveur`'
        //     + ':ilyzaelle: ➔ `Ilyzaelle`'
        //     + ':jahash: ➔ `Jahash`'
        //     + ':shiba: ➔ `Client﻿`'
        //     + ':passeur: ➔ `Passeur`');

		await interaction.channel.send({ embeds: [exampleEmbed], components: [row] });
	},
};
