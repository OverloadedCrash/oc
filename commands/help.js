const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const commandPath = __dirname;
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
let commands = []

for (const file of commandFiles) {
  const command = require(`./${file}`);
  if (file != "help.js") {
    commands.push(command)
  }
}
module.exports = {
  enabled: true,
  developerOnly: false,
  linkLock: false,
  disableDM: false,
  
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gets a list of commands!'),

  async execute(client, interaction, roblox) {
    if (this.enabled == false) return;
    if(this.developerOnly == true && interaction.user.id != "1111485486607892562") return;
    
    const verifyEmbed = new EmbedBuilder()
        .setColor(0xff3224)
        .setDescription(`## Command List\n\nThe following is a list of commands available to use!\n* ⚪ Enabled and unlocked command.\n* ⚫ Disabled and unlocked command.\n* 🔒 Developer only command.\n* 🔐 Unlocked by **linking your account.**`)
        .setFooter({text: 'AHA Commands'})
        .setTimestamp()
      for(let i = 0; i < commands.length; i++) {
        let command = commands[i];
        let enabledIcon; if(command.enabled == true) {enabledIcon = "⚪"} else{enabledIcon = "⚫"}
        let opt = [];
        let options = command.options.forEach(o => {
          opt.push("``" + o + "``")
        })
        opt = opt.join(" ")
        if(command.linkLock == true) {enabledIcon = "🔐"}
        if(command.developerOnly == true) {enabledIcon = "🔒"}
        
        verifyEmbed.addFields({ name: `${enabledIcon} ${command.data.name} ${opt}`, value: command.data.description, inline: false})
      }
      interaction.reply({content: "", embeds: [verifyEmbed], ephemeral: true})
  }
}