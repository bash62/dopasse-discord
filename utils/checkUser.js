const CU = require('../database/controllers/User.js');
const mongoose = require('mongoose');
const User = require('../database/models/User.js');

module.exports.checkUser = async (interaction) => {

	const user = await CU.get(interaction.user.id).then(res => {
		return res[0];
	});

	if (!user) {

		return false;
	}
	else {
		return true;
	}

};

module.exports.getUser = async (interaction) => {


	const user = await CU.get(interaction.user.id).then(res => {
		console.log(`L'utilisateur ${res} est crée.`);
	});
	return user;
};