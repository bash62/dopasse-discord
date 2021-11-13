module.exports = {
	name: 'messageCreate',
	description: 'Sets up a reaction role message.',
	once: false,
	async execute(message) {
		console.log(`${message}`);
	},
};