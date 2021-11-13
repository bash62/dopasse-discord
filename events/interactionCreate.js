const { choixId, everyoneRole } = require('../config.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'interactionCreate',
	description: 'Sets up a reaction role message.',

	async execute(interaction, client) {
		// Look if the interaction is emit from a button
		if (!interaction.isCommand() && interaction.componentType == 'BUTTON') {

			switch (interaction.channelId) {
			// Channel name : Choix-server case
			case choixId: {
				// Reset button : Reset every roles attributed
				if (interaction.customId === 'reset') {
					// Get all roles and removes them
					interaction.member.roles.cache.some(rolez => {
						if (rolez.id !== everyoneRole) {
							interaction.member.roles.remove(rolez);
						}
					});
					await interaction.reply({ content:'Your roles have been reseted !', ephemeral:true });
					break;
				}

				// @choixRole : Role : Role correspondant aux boutons créers.

				const choixRole = interaction.guild.roles.cache.get(interaction.customId);
				if (!interaction.member.roles.cache.has(interaction.customId)) {
					interaction.member.roles.add(choixRole);
					createGuildChannel(interaction);
					await interaction.reply({ content:'Your roles have been updated!', ephemeral:true });
				}
				else {
					await interaction.reply({ content:'You already registered for this role !', ephemeral:true });

				}
				break;
			}
			}
			return;
		}
		else {
			client.commands.get(interaction.commandName).execute(interaction);
		}
	},
};


function createGuildChannel(interaction) {

	interaction.guild.channels.create('test', { type: 'text' }).then(async channel => {
		const category = interaction.message.guild.channels.cache.get('907388351802376313');
		await channel.setParent(category);


		const embed = new MessageEmbed()
			.setTitle('Demande d\'aide en ')
			.setColor('#5e00ff')
			.setDescription('Tu peux poser ta question ou exposer ton problème ici.\n' +
					'Les autres pourront ainsi t\'aider le résoudre\n\n' +
					'Merci de respecter certaines règles :\n' +
					'   - Enonce clairement ton problème\n' +
					'   - Ajoute des morceaux de codes ou des images\n' +
					'   - Ferme la demande d\'aide une fois terminé en réagissant ci-dessous');

		const message_send = await channel.send({ embeds : [embed] });
		message_send.react('🇫🇷');


	});

}