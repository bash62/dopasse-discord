const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { CHANNEL_ID, LOGO } = require('../config.json');
const { NEW_USER } = require('./questions.json');
const CU = require('../database/controllers/User.js');
const mongoose = require('mongoose');
const User = require('../database/models/User.js');

/**
 *  createChannel create a ticket by pressing a button
 * @param {*} interaction
 * @param {*} firstTimeUser : Check if user is already store in database
 */


module.exports.newUserOffer = (interaction) => {

	interaction.guild.channels.create('Ticket-' + interaction.user.username, { type: 'text' }).then(async channel => {
		const category = interaction.message.guild.channels.cache.get(CHANNEL_ID.CHANNEL_TICKET);
		await channel.setParent(category);

		// Ghost ping
		const messagePing = await channel.send(`<@${interaction.user.id}>`);
		setTimeout(() => messagePing.delete(), 100);
		let user = await CU.get(interaction.user.id);
		const user_serveur = JSON.parse(user[0].serveur);
		let embed = new MessageEmbed();
		Object.entries(user_serveur).forEach(([key, value]) => {
			console.log(`${key} ${value}`);
		});
		//Check if the User is already registered in BDD

		await interaction.reply({ content:' Your ticket have been created, follow for more instructions ' + '<#' + channel.id + '>', ephemeral:true });
	});
};


