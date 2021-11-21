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


module.exports.createChannel = (interaction, firstTimeUser) => {

	interaction.guild.channels.create('Ticket-' + interaction.user.username, { type: 'text' }).then(async channel => {
		const category = interaction.message.guild.channels.cache.get(CHANNEL_ID.CHANNEL_TICKET);
		await channel.setParent(category);

		// Ghost ping
		const messagePing = await channel.send(`<@${interaction.user.id}>`);
		setTimeout(() => messagePing.delete(), 100);
		let embed = new MessageEmbed();

		if (!firstTimeUser) {

			embed = new MessageEmbed()
				.setTitle('Nous voyons que c\'est la première fois que vous ajouter une offre.')
				.setColor('#0099ff')
				.setDescription('Pour continuer veuillez enregistrer votre profile.')
				.setThumbnail(LOGO.URL_QUESTION_MARK);


			const messageSent = await channel.send({ embeds : [embed] });
			embed = messageSent.embeds[0];

			const filter = (message) => {
				return message.author.id === interaction.user.id;
			};

			embed.description = null;
			embed.title = NEW_USER.USERNAME;
			embed.thumbnail = null;

			setTimeout(() => messageSent.edit({ embeds:[embed] }), 3000);

			const roles = {};
			interaction.member.roles.cache.forEach(function(element) {
				if (!element.name.includes('@everyone')) {
					roles[element.name] = element.id;
				}
			});

			const newUser = new User(
				{
					username : interaction.user.username,
					userId: interaction.user.id,
					serveur: JSON.stringify(roles),
					ingame_username: 'admin',
					profile_url: 'https://www.dofus.com/en/mmorpg/community/directories/character-pages/284534400207-darkfeudala',
					findUs: 'Dans ton cul',
				});

			const collector = channel.createMessageCollector({ filter, max: 3 });

			let questions = 0;

			collector.on('collect', message => {


				switch (questions) {
				case 0 : {
					newUser.ingame_username = message;
					embed.title = NEW_USER.PROFILE_URL;
					break;
				}
				case 1 : {
					newUser.profile_url = message;
					embed.title = NEW_USER.FIND_US;
					break;
				}
				case 2 : {
					newUser.findUs = message;
					break;
				}
				}

				questions += 1;
				console.log(newUser);
				messageSent.edit({ embeds:[embed] });
				setTimeout(() => message.delete(), 1);

			});

			collector.on('end', () => {
				const validateEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Le passage sur dofus 2.0')
					.setURL('https://discord.gg/SqrMVPzB')
					.setDescription('Le meilleur discord de passeur.')
					.setThumbnail(LOGO.URL_DOFUS_SUCCES)
					.addFields(
						{ name: 'Nom de votre personnage:', value: newUser.ingame_username },
						{ name: 'Lien de votre profil :', value: newUser.profile_url },
					);
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('validate')
							.setLabel('Valider')
							.setStyle('SUCESS'),
					)
					.addComponents(
						new MessageButton()
							.setCustomId('discard')
							.setLabel('Annuler')
							.setStyle('DANGER'),
					);

				messageSent.edit({ embeds:[validateEmbed], components: [row] });
				const button_collector = messageSent.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

				button_collector.on('collect', async i => {
					if (i.user.id === interaction.user.id) {
						if(i.customId === 'validate'){
							await CU.create(newUser).then(res => {
								console.log(`L'utilisateur ${res} est crée.`);
							});
						}
						else{
							console.log("reseted")
						}
						i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
					}
				});
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


		await interaction.reply({ content:' Your ticket have been created, follow for more instructions ' + '<#' + channel.id + '>', ephemeral:true });
	});
};


