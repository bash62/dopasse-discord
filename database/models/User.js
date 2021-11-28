const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

	username: {
		type: String,
		required : true,
	},
	active_channel: {
		type: String,
		default: null,
	},

	ingame_username: {
		type: String,

	},

	profile_url : {
		type: String,
	},

	userId: {
		type: String,
		unique: true,
	},

	createdAt: {
		type : Date,
		default: Date.now(),
	},


	serveur : {
		type : String,
		default : null,

	},

	findUs : {
		type : String,
		default : null,
	},

	offers : {
		passage : {
			type : String,
			default: null,
		},
		kit : {
			type : String,
			default: null,
		},
		feedback : {
			type : String,
			default: null,
		},
	},
});

module.exports = mongoose.model('User', UserSchema);