const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

module.exports = {
  enabled: true,
  developerOnly: false,
  linkLock: false,
  disableDM: false,
  
  data: new SlashCommandBuilder()
    .setName('connectivity')
    .setDescription(`Checks the bot's connectivity with Roblox's servers, Discord latency, and uptime!`),

  options: [],

  async execute(client, interaction, roblox, events) {
    if (this.enabled == false) return;
    if(this.developerOnly == true && interaction.user.id != "1111485486607892562") return;
    let date = new Date();
    try{
      const verifyEmbed = new EmbedBuilder()
        .setColor(0xff3224)
        .setDescription(`## Bot Connectivity\n\nThe following is a list of specifications that the bot's status is currently in.\n* ⌚ ${msToTime(client.uptime)}\n* 🟢 ${new Date() - date} ms`)
        .setFooter({text: 'AHA Connectivity'})
        .setTimestamp()
      interaction.reply({content: "", embeds: [verifyEmbed], ephemeral: true})
    }catch(e) {
      return console.log(e);
    }
  }
}