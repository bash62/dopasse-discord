const { ROLES_ID, CHANNEL_ID } = require('../config.json');
const { newUserChannel } = require('../utils/createChannelNewUser');
const { newUserOffer } = require('../utils/createChannelNewOffer');
const { checkUser,getUser } = require('../utils/checkUser');

module.exports = {
	name: 'interactionCreate',
	description: 'Sets up a reaction role message.',

	async execute(interaction, client) {
		// Look if the interaction is emit from a button
		console.log(interaction.componentType);
		if (!interaction.isCommand() && (interaction.componentType == 'BUTTON' || interaction.isSelectMenu())) {

			switch (interaction.channelId) {

			// Channel name : Choix-server case
			case CHANNEL_ID.CHANNEL_CHOICES: {
				// Reset button : Reset every roles attributed
				if (interaction.customId === 'reset') {
					// Get all roles and removes them
					interaction.member.roles.cache.some(role => {
						if (role.id !== ROLES_ID.EVERYONE) {
							if (role.id !== ROLES_ID.MODERATOR) {
								interaction.member.roles.remove(role);
							}

						}
					});
					await interaction.reply({ content:'Your roles have been reseted !', ephemeral:true });
					break;
				}

				// @choixRole : Role : Role correspondant aux boutons créers.

				const choixRole = interaction.guild.roles.cache.get(interaction.customId);
				if (!interaction.member.roles.cache.has(interaction.customId)) {
					interaction.member.roles.add(choixRole);

					await interaction.reply({ content:'Your roles have been updated!', ephemeral:true });
				}
				else {
					await interaction.reply({ content:'You already registered for this role !', ephemeral:true });

				}
				break;
			}
			case CHANNEL_ID.CHANNEL_OFFER: {


				const userExist = await checkUser(interaction);
				if(!userExist) newUserChannel(interaction, userExist);
				else {
					newUserOffer(interaction);
				}
			}
			}
			return;
		}
		else {
			client.commands.get(interaction.commandName).execute(interaction);
		}
	},
};