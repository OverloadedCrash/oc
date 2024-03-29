const {Client, Events, Collection, EmbedBuilder, GatewayIntentBits, REST, Routes} = require('discord.js');

const token = process.env.TOKEN;

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers]});
console.log(`Test`)

// const roblox = require("./roblox")
var bodyParser = require('body-parser')
const noblox = require('noblox.js')
const events = require('noblox.js')

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
  try{
    currentUser = await noblox.setCookie(process.env.COOKIE.toString()); 
    let groupId = 17198776;
    const messageEvent = noblox.onJoinRequest(groupId)
    messageEvent.on("data", async function(data) {
      try{
        let handled = await noblox.handleJoinRequest(groupId, data.requester.userId, true)
        let shouted = await noblox.shout(groupId, `Welcome to the project, ${data.requester.username}.`)
        console.log(`Done.`)
      }catch(e) {
        console.log(`Error doing either the shout or the join request!`)
      }
    })
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

  app.post(`/setrank`, async (req, res) => {
    if(req.body.apiKey) {
      if(req.body.apiKey != process.env.API_KEY.toString()) return res.send({error: `The API key supplied does not match the server's API key!`, data: ``})
      if(!req.body.userId || !req.body.groupId || !req.body.rank) return res.send({error: `You must include the 'groupId', 'userId', or 'rank' body params!`, data: ``})
      try{
        await noblox.setRank(req.body.groupId, req.body.userId, req.body.rank)
        res.send({error: ``, data: `Successfully set rank of the user!`})
      }catch(e) {
        res.send({error: `The server was unable to set the rank of this user!`, data: ``})
      }
    }else{
      res.send({error: `You must provide an API key!`, data: ``})
    }
  })

  app.listen(4000);
})

client.on(Events.InteractionCreate, async interaction => {
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
