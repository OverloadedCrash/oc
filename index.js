const {Client, Events, Collection, EmbedBuilder, GatewayIntentBits, REST, Routes} = require('discord.js');

const token = process.env.TOKEN;

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers]});

// const roblox = require("./roblox")
var bodyParser = require('body-parser')
const noblox = require('noblox.js')

client.commands = new Collection();

const fs = require('node:fs');
const path = require('node:path');
const rest = new REST({version: '10'}).setToken(token);

const commands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  const filePath = path.join(commandPath, file);
  let com = require(filePath);
  if('data' in com && 'execute' in com) {
    client.commands.set(com.data.name, com)
  }else{
    console.log(`[Warning] The command at ${filePath} is missing a required 'data' or 'execute' property.`)
  }
}

var blacklistedWords = ["UltimeBob1", "hacking", "tubers93", "v3rmillion", "vermillion", "edgelord", "c00lkidd", "coolkidd", "tubers", "hack", "haker", "hacker", "bunbun", "hax", "1x1", "2x2", "3x3", "testbot", "anonymous", "johndoe", "john_doe", "janedoe", "jane_doe", "snypase", "jjsploit", "krnl", "sk8r", "hacke", "hacking", "expro", "exploiter", "exploit", "coolkid", "666", "coolkid", "666", "guest"];
var whitelistedGroupIds = [201622, 32392862, 32452168];

function checkForBlacklist(str) {
  for (let word in blacklistedWords) {
    if (str.toString().toLowerCase().includes(blacklistedWords[word].toString().toLowerCase())) {
      return true
    }
  }
  return false
}

function checkGroups(groups) {
  for (let group in groups) {
let groupData = groups[group]
    if(checkForBlacklist(groupData.Name) == true && !whitelistedGroupIds.includes(groupData.Id))
    {
return true
    }  
  } 
return false
}

 async function doAutomation(robloxC) {
  if(!robloxC) return;
  let group = 201622
  let checkRoles = {awaiting: 1122034, jailed: 5309509, class: 1113148}
  let users = await noblox.getPlayers(201622, checkRoles.awaiting)
  for (let user in users) {
      let userInfo = users[user];
      let checkName = checkForBlacklist(userInfo.username) || checkForBlacklist(userInfo.displayName)
      let roles = await noblox.getGroups(userInfo.userId)
      let checkGroup = checkGroups(roles)
      let blacklist = checkGroup == true || checkName == true
      if(blacklist == true) {
        let res = await noblox.setRank(201622, userInfo.userId, checkRoles.jailed)
      }else{
        let res = await noblox.setRank(201622, userInfo.userId, checkRoles.class)
    }
  }
}



console.clear();

let robloxC; 

client.once(Events.ClientReady, async c => {
  try{ 
    const data = await rest.put(
      Routes.applicationCommands(c.user.id), {body: commands},
    );
    console.log(`Successfully reloaded ${data.length} application commands!`)
  }catch(e) {
    console.log(e)
  }

  let currentUser;
  try{currentUser = await noblox.setCookie(process.env.NEWCOOKIE.toString()); doAutomation(currentUser); 
    setInterval(async function() {
      doAutomation(currentUser)
    }, 20000)
  }catch(e){console.log}

  console.log(`Ready, logged in as ${c.user.tag}!`)

  const express = require("express");
  const app = express();
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  
  app.get("/", async (req, res) => {
    try{res.send(JSON.stringify(client.user))} catch(e) {
      res.send({})
    }
  })

  app.listen(4000);
})

let blisted = ["1134805838050103316"]

client.on(Events.GuildMemberAdd, async member => {
  if(blisted.includes(member.id.toString())) return member.kick("Blacklisted.");
  let role = member.guild.roles.cache.find(r => r.id === "1078503125213790318")
  member.roles.add(role)
})

client.on(Events.InteractionCreate, async interaction => {
  if(interaction.isModalSubmit()) {
    if(interaction.customId.toString().includes("reportModal")) {
      let type = interaction.customId.toString().split("-")[1] || "N/A"
      
      const reporting = interaction.fields.getTextInputValue('reporting') || "No reported was provided.";
      const reportDescription = interaction.fields.getTextInputValue('reportDescription') || "No description was provided.";
      const links = interaction.fields.getTextInputValue('reportLinks') || "N/A";
      const evidence = interaction.fields.getTextInputValue('reportEvidence') || "N/A";


      let username = interaction.member.id
      let channel;
      if(type == "exploiter") {channel = "732566735772712965"}else if(type == "group") {channel = "927362457473802351"}else if(type == "scammer") {channel = "737306541048463380"}

      if (channel != null) {
        client.channels.cache.get(channel).send({
           content: "```A new report has been submitted!```" + `\n> * ` + "``Who?:``" + ` ${reporting}\n> * ` + "``Relevant links?:``" + ` ${links}\n> * ` + "``Evidence?:``" + ` ${evidence}\n> * ` + "``Report Description``: " + `${reportDescription}\n\n > Members will not be able to post here by default. If you are a Council member and want more information, then please contact them via their direct messages. ||<@${interaction.user.id}>||.\n\n> If you are the original reporter, then please wait while we investigate your report. If we find it to be a valid report, then your post will be approved and further instructions will be given. Remember that false reports will result in potential moderation action.\n\n` + "```Thank you for submitting this report!```",
        }).then(async function() {
          await interaction.reply({content: "Successfully submitted!", ephemeral: true})
        })
    }}
  }
  
  if(!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if(!command) {
    console.log(`No commands matching ${interaction.commandName} was found!`)
    return;
  }
  
  try{
    if (command.enabled == false) return;
      if(command.developerOnly == true && interaction.user.id != "1111485486607892562") return await interaction.reply({content: 'Sorry, but you do not have permission to use this command!', ephemeral: true});
      if(command.disableDM == true && interaction.guildId == null) return await interaction.reply({content: 'Sorry, but you can only use this command in servers!', ephemeral: true});
    await command.execute(client, interaction, noblox)
  }catch(e) {
    console.log(e)
    if(interaction.replied || interaction.deferred) {
      await interaction.followUp({content: 'There was an error while executing this command!'})
    }else{
      await interaction.reply({content: 'There was an error while executing this command!'})
    }
  }
})

client.login(token);
