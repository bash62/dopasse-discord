const CU = require('../database/controllers/User.js');
const mongoose = require('mongoose');
const User = require('../database/models/User.js');

module.exports.checkUser = async (interaction) => {

	const user = await CU.get(interaction.user.id).then(res => {
		return res[0];
	});
	return user;
	if (!user) {

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
			});

		await CU.create(newUser).then(res => {
			console.log(`L'utilisateur ${res} est crée.`);
		});
		return false;
	}
	else {
		return true;
	}

};

module.exports.addUser = (interaction) => {

	return;
};