const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
  enabled: true,
  developerOnly: true,
  linkLock: false,
  
  data: new SlashCommandBuilder()
    .setName('shout')
    .setDescription('Shouts a new message on the group shout!')
    .addStringOption((option) =>
  		option.setName('message').setDescription('The message of the shout.').setRequired(false)
  	),

  options: ["message"],

  async execute(client, interaction, roblox, events) {
    if (this.enabled == false) return;
    if(this.developerOnly == true && interaction.user.id != "1111485486607892562") return;
    let hasRole = interaction.member.roles.cache.some(r => r.id === "1108160095885459496")
    if(hasRole != true) return;
    
    try{
      if(events) {
        let user = await events.getCurrentUser();
        let message = interaction.options.getString(`message`) || " ";
        if (user && message) {
            events.shout(201622, message)
            interaction.reply({content: `Successfully sent shout!`, ephemeral: true})
        }
      }
    }catch(e) {
        console.log(`An error has occurred!`)
    }
  }
}