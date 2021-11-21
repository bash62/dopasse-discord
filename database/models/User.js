const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

	username: {
		type: String,
		required : true,
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

	offers : {
		passage : {
			type : String,
		},
		kit : {
			type : String,
		},
		feedback : {
			type : String,
		},
	},
});

module.exports = mongoose.model('User', UserSchema);