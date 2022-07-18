const Discord = require("discord.js");
const client = new Discord.Client({
    intents: 32767
})
const config = require ('./config.json')

client.login(config.token)

global.Discord = require("discord.js");
global.client = new Discord.Client({
    intents: 32767
})
global.config = require('./config.json')
global.log = config.log
global.moment = require('moment')
const fs = require('fs')
const ms = require('ms')


const prefix = `!`;
    

client.on("ready", () =>{
    console.log("Bot online!")
    var embedonline = new Discord.MessageEmbed()
    .setTitle("Stato bot!")
    .setDescription("✅ | Il bot è andato correttamente online!")
    .addField("Stato:", "🟢 | Online", true)
    .setColor("GREEN")
    .setTimestamp()
    
    client.channels.cache.get(config.log).send({embeds: [embedonline]})


    client.guilds.cache.forEach(guild => {
        guild.commands.create({
            name: "ping",
            description: "Ping del bot"
        })
    })
})


client.commands = new Discord.Collection();

const commandsFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const commandsFolder = fs.readdirSync(`./commands`);
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(`.js`));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith(`.js`));

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            client.on(event.name, (...args) => event.execute(...args));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}


client.on(`messageCreate`, message => {


    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) return

    var comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

    comando.execute(message, args);
})

