const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
  enabled: true,
  developerOnly: false,
  linkLock: false,
  disableDM: false,
  
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gets a list of commands!'),

  async execute(client, interaction, roblox, events) {
    interaction.reply({content: `Working!`})
  }
}