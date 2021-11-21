const Controller = require('../Controller');

class User extends Controller {
	constructor() {
		super('User');
	}

	/**
     *
     * @param {ObjectId} _id
     * @param {ObjectId} guild_id
     * @param {String} userID
     * @param {Object} options
     * @returns {Promise<Array<Object>>}
     */

	async get(userID, options = { limit: undefined, type: undefined }) {

		const t = { userId : userID };

		return await super.get(t, { limit: options.limit });
	}

	/**
     *
     * @param {ObjectId} _id
     * @param {String} type
     * @param {*} value
     * @returns {Promise<unknown>}
     */
	async update(_id, type, value) {
		let t;
		switch (type) {
		case 'money':
			t = { money: value };
			break;
		case 'tag':
			t = { tag: value };
			break;
		case 'game':
			t = { game: value };
			break;
		case 'win':
			t = { win: value };
			break;
		case 'loose':
			t = { loose: value };
			break;
		case 'gain':
			t = { gain_tot: value };
			break;
		case 'mise':
			t = { mise_tot: value };
			break;
		case 'daily':
			t = { daily_claimed: value };
			break;
		case 'avatar':
			t = { userAvatar: value };
			break;
		case 'nb_vote':
			t = { nb_vote: value };
			break;
		case 'voted':
			t = { voted: value };
			break;
		case 'xp':
			t = { xp: value };
			break;
		}

		return await super.update({ _id }, t);
	}

	/**
     *
     * @param {Object} data
     * @returns {Promise<unknown>}
     */

	async create(data) {
		return await super.create(data);
	}

	/**
     *
     * @param {ObjectId} _id
     * @returns {Promise<Array<Object>>}
     */

	async delete(_id, guild_id, userID) {
		let t = {};
		if (_id) t = { _id };
		if (guild_id) t = { guild_id };
		if (userID) t = { userID };

		return await super.delete(t);
	}
}

module.exports = new User();

