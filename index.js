const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

const { DB_URI } = require('./config.json');

const client = new Client({ intents: 32767 });

mongoose.connect(DB_URI);
// const client = new Client({ intents: [
// 	Intents.FLAGS.GUILDS,
// 	Intents.FLAGS.GUILD_MESSAGES,
// 	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,

// ],


// });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(process.env.TOKEN);

