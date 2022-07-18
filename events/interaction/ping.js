const client = new Discord.Client({
    intents: 32767
})

module.exports = {
    name: "interactionCreate",
    execute(interaction) {
        var embed = new Discord.MessageEmbed()
            .setTitle("Ping del bot")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", `${client.ws.ping}ms`)
            interaction.reply({embeds: [embed], ephemeral: true})
    }
}