const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { CHANNEL_ID, LOGO } = require('../config.json');
const { NEW_USER } = require('./questions.json');
const CU = require('../database/controllers/User.js');
const mongoose = require('mongoose');
const User = require('../database/models/User.js');

/**
 *  newUserChannel create a ticket by pressing a button
 * @param {*} interaction
 * @param {*} userExist : Check if user is already store in database
 */


module.exports.newUserChannel = (interaction, userExist) => {


	interaction.guild.channels.create('Ticket-' + interaction.user.username, { type: 'text' }).then(async channel => {
		const category = interaction.message.guild.channels.cache.get(CHANNEL_ID.CHANNEL_TICKET);
		await channel.setParent(category);

		// Ghost ping
		const messagePing = await channel.send(`<@${interaction.user.id}>`);
		setTimeout(() => messagePing.delete(), 100);
		let embed = new MessageEmbed();

		//Check if the User is already registered in BDD
		if (!userExist) {

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

			embed.thumbnail.width = 120;
			embed.thumbnail.height = 120;
			embed.title = NEW_USER.USERNAME;
			
			

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

			const collector = channel.createMessageCollector({ filter});

			let questions = 0;

			collector.on('collect', message => {

				if(typeof(message.content) === 'string' && message.content !== ''){
					switch (questions) {
						case 0 : {
							newUser.ingame_username = message;
							embed.title = NEW_USER.PROFILE_URL
							questions += 1; 
							messageSent.edit({ embeds:[embed] });
							break;
						}
						case 1 : {
							newUser.profile_url = message;
							embed.title = NEW_USER.FIND_US;
							questions += 1;
							messageSent.edit({ embeds:[embed]});
							break;
						}
						case 2 : {
							newUser.findUs = message;
							const validateEmbed = new MessageEmbed()
							.setColor('#0099ff')
							.setDescription('/!\\ Une fois enregistrer vous ne pourrez plus modifier votre profil. /!\\ ')
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
									.setStyle('SUCCESS'),
							)
							.addComponents(
								new MessageButton()
									.setCustomId('discard')
									.setLabel('Annuler')
									.setStyle('DANGER'),
							);
		

		
						const button_collector = messageSent.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
						messageSent.edit({ embeds:[validateEmbed], components: [row] });
						button_collector.on('collect', async i => {
							console.log(i)
							if (i.user.id === interaction.user.id) {
								if(i.customId === 'validate'){
									await CU.create(newUser).then(async res => {
										console.log(`L'utilisateur ${res} est crée.`);
										await channel.send({ content:'Vous êtes bien enregistré !', ephemeral:true});
										setTimeout(() => channel.delete() , 5000);
		
										
									});
								}
								else{
									await channel.send({ content:'Vous avez annulé votre inscriptions !', ephemeral:true});
									setTimeout(() => channel.delete() , 1000);
									}}});
							}
						}
				}

				setTimeout(() => message.delete(), 1);

			});
		}
		await interaction.reply({ content:' Your ticket have been created, follow for more instructions ' + '<#' + channel.id + '>', ephemeral:true });
	});
};


