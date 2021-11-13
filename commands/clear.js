const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Replies with Pong!'),
	async execute(message) {


		const channel = '907376502700658758';

		const interserveur_role = message.guild.roles.cache.find(role => role.name === 'Interserveur');
		const ilyzaelle_role = message.guild.roles.cache.find(role => role.name === 'Ilyzaelle');
		const jahash_role = message.guild.roles.cache.find(role => role.name === 'Jahash');
		const passeur_role = message.guild.roles.cache.find(role => role.name === 'Passeur');
		const client_role = message.guild.roles.cache.find(role => role.name === 'Client');

		const interserveur_emoji = ':interserveur:';
		const ilyzaelle_emoji = ':ilyzaelle:';
		const jahash_emoji = ':jahash:';
		const passeur_emoji = ':passeur:';
		const client_emoji = ':client:';

		const embed = new Discord.MessageEmbed()
			.setColor('#e62643')
			.setTitle('Choisi tes roles ! ')
			.setDescription('@everyone\n\n'
                + '> Le but de ce discord est d\'automatiser les passages sur dofus. Vous pouvez vous enregister en tant que passeur  :passeur: ( Donjons, avis, quête... )  ou en tant que client  :shiba: '
                + '\n__**Pour commencer, choisissez votre serveur et votre role en cliquant sur l\'émoticône correspondante sous ce message : **__' +
                +':interserveur: ➔ `Interserveur`'
                + ':ilyzaelle: ➔ `Ilyzaelle`'
                + ':jahash: ➔ `Jahash`'
                + ':shiba: ➔ `Client﻿`'
                + ':passeur: ➔ `Passeur`');

		const MessageEmbed = await message.channel.send(embed);

	},
};
