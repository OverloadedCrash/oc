const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const clean = async (text) => {
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });
  
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  
  return text;
}

module.exports = {
  enabled: true,
  developerOnly: true,
  linkLock: false,
  
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Runs server-sided code.')
    .addStringOption((option) =>
  		option.setName('code').setDescription('The code that you would like executed!').setRequired(true)
  	),

  options: ["code"],

  async execute(client, interaction, roblox, events) {
    if (this.enabled == false) return;
    if(this.developerOnly == true && interaction.user.id != "1111485486607892562") return;
    try{
      const originalLog = console.log;
      
      const evaled = eval(interaction.options.getString("code"));
      const cleaned = await clean(evaled);
      interaction.reply({content: "```Sucessfully executed code, nothing logged!```", ephemeral: true});
    }catch(e) {
      interaction.reply({content: (`Error:\n\`\`\`js\n${e}\n\`\`\``), ephemeral: true});
    }
  }
}