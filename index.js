/*
  _____.__        ___.    .________
_/ ____\  |   ____\_ |__  |   ____/
\   __\|  | _/ __ \| __ \ |____  \ 
 |  |  |  |_\  ___/| \_\ \/       \
 |__|  |____/\___  >___  /______  /
                 \/    \/       \/ 
        Developed by fleb5
*/
// Discord Js
const { ButtonInteraction, MessageSelectMenu, MessageButton, MessageActionRow } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ 
    partials: ["CHANNEL"], 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    autoReconnect: true,
    disableEveryone: true,
    fetchAllMembers: true,
});
client.discord = require('discord.js'); 

// Chalk
client.chalk = require("chalk");

// Config
client.config = require('./config.json');

// Mysql
client.mysql = require("mysql");

var db = client.mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'licenze',
  timezone: 'Italy'
});

db.connect(function(err) {
  if (err) {
    console.log(client.chalk.red("Log: ") + 'Error in database error')
    return;
  }else{
    console.log(client.chalk.green("Log: ") + 'Successfully connected from the database')
  }
  
  setInterval(function () {
    db.query('SELECT 1');
  }, 5000);

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("error", console.error);
client.on("warn", console.warn);
client.login(client.config.bot.token);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("ready", () => {
    console.log(client.chalk.green("Log: ") + `Bot started successfully`);
    console.log(client.chalk.green("Log: ") + "BOT Connected "+ client.chalk.blueBright("["+ client.user.tag + "]"));
    client.user.setActivity(`Auth Bot`, { type: 'WATCHING' })
    console.log(client.chalk.blueBright(`\n                                                                                                                                                 
                db       88        88 888888888888 88        88
               d88b      88        88      88      88        88
              d8  8b     88        88      88      88        88
             d8    8b    88        88      88      88aaaaaaaa88
            d8YaaaaY8b   88        88      88      88""""""""88 
           d8        8b  88        88      88      88        88
          d8          8b Y8a.    .a8P      88      88        88
         d8            8b   Y8888Y         88      88        88 
        
                                   by fleb5                                                   
    `));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

setInterval(function(){
    console.log(client.chalk.red("Log:")+' Checking for expired keys...');
  
    db.query("UPDATE licenses SET `valid` = 'false' WHERE `total_time` <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)", function (err) {
  
        if (err) {
            return console.log(err);
        }
  
    });
  
  }, 60000);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("message", message => {
    const args = message.content.slice(client.config.server.prefix.length).split(/ +/g)
    if(message.content.startsWith(client.config.server.prefix))
        if(message.guild === null) {
            const embed = new client.discord.MessageEmbed()
                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                .setDescription('**__COMMANDS CANNOT BE USED IN PRIVATE!__**')
                .setColor('#e2574c')
                .setTimestamp()
                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                
            message.channel.send({embeds: [embed]});
            return;
        }else
            switch(args[0]){
                case "create":
                     if(message.member.roles.cache.has(client.config.server.staffrole)){
                        if(args[1]){
                            var string = createsto();
                            const messaggiocrea = new client.discord.MessageEmbed()
                                .setColor('BLUE')
                                .setTimestamp()
                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                .setAuthor('License Created!')
                                .setDescription(`The key **` + string + `** was successfully generated.\nExpiration date: **` + args[1] + `**\n\n Created on: **` + message.createdAt.toLocaleDateString() + `**\n Created by: ** <@` + message.author.id + `> **`)
                            message.reply({embeds: [messaggiocrea]});
                            message.guild.channels.cache.get(client.config.log.crea).send({embeds: [messaggiocrea]});
                            db.query(`INSERT INTO licenses (license, total_time, created_by, valid) VALUES ('${string}', '${args[1]}', '${message.author.id}', '${"true"}')`);
                        }else
                            message.reply("You must enter an expiration date! (Format: YYYY-MM-DD)");
                    }else
                        message.reply("You don't have enough privileges!");
            
                    function createsto() {
                        var testo = "";
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

                        for (var i = 0; i < 4; i++){
                            for(var j = 0; j < 4; j++)
                                testo += characters.charAt(Math.floor(Math.random() * characters.length));
                            if(i != 3)
                                testo += "-"
                        }

                        return testo;
                    }
                    break;
                case "createcustom":
                     if(message.member.roles.cache.has(client.config.server.staffrole))
                        if(args[1])
                            if(args[2]){
                                const messaggiocrea = new client.discord.MessageEmbed()
                                    .setColor('BLUE')
                                    .setTimestamp()
                                    .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    .setAuthor('License Created!')
                                    .setDescription(`The key **` + args[2] + `** was successfully generated.\nExpiration date: **` + args[1] + `**\n\n Created on: **` + message.createdAt.toLocaleDateString() + `**\n Created by: ** <@` + message.author.id + `> **`)
                                message.reply({embeds: [messaggiocrea]});
                                message.guild.channels.cache.get(client.config.log.crea).send({embeds: [messaggiocrea]});
                                db.query(`INSERT INTO licenses (license, total_time, created_by, valid) VALUES ('${args[2]}', '${args[1]}', '${message.author.id}', '${"true"}')`);
                            }else
                                message.reply("You must enter a license!");
                        else
                            message.reply("You must enter an expiration date! (Format: YYYY-MM-DD)");
                    else
                        message.reply("You don't have enough privileges!");
                    break;
                case "delete":
                     if(message.member.roles.cache.has(client.config.server.staffrole))
                        if(args[1])
                            db.query('SELECT * FROM licenses WHERE license = ?', [args[1]], function (err, result) {
                                if(err){
                                    const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                }
                                if (result.length > 0)
                                    if (result){
                                        db.query(`DELETE FROM licenses WHERE license = '${args[1]}'`)
                                        const rimossaconsuccesso = new client.discord.MessageEmbed()
                                            .setAuthor('LICENSE DELETED!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                            .setDescription('Author: <@'+ message.author.id +'> \nLicense Removed: **'+ args[1] +'**')
                                            .setColor('RED')
                                            .setTimestamp()
                                            .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                        message.reply({embeds: [rimossaconsuccesso]});
                                        message.guild.channels.cache.get(client.config.log.rimuovi).send({embeds: [rimossaconsuccesso]});
                                    }else{
                                        const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                    }
                                else{
                                    const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                }
                            });
                        else
                            message.reply("You must enter a license!");
                    else
                        message.reply("You don't have enough privileges!");
                    break;
                case "reset":
                     if(message.member.roles.cache.has(client.config.server.staffrole))
                        if(args[1])
                            db.query('SELECT * FROM licenses WHERE license = ?', [args[1]], function (err, result) {
                                if(err){
                                    const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                }
                                if (result.length > 0)
                                    if (result){
                                        db.query(`UPDATE licenses SET ip = NULL WHERE license = '${args[1]}'`)
                                        const resettata = new client.discord.MessageEmbed()
                                            .setAuthor('IP LICENSE RESETTED!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                            .setDescription('Author: <@'+ message.author.id +'> \nLicense Resetted: **'+ args[1] +'**')
                                            .setColor('RED')
                                            .setTimestamp()
                                            .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                        message.reply({embeds: [resettata]});
                                        message.guild.channels.cache.get(client.config.log.reset).send({embeds: [resettata]});
                                    }else{
                                        const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                    }
                                else{
                                    const embed = new client.discord.MessageEmbed()
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('Invalid license!')
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                    return message.reply({embeds: [embed]});
                                }
                            });
                        else
                            message.reply("You must enter a license!");
                    else
                        message.reply("You don't have enough privileges!");
                    break;
                case "redeem":
                    db.query('SELECT * FROM licenses WHERE license = ?', [args[1]], function (err, result) {
                        if(err){
                            const embed = new client.discord.MessageEmbed()
                                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                .setDescription('Invalid license!')
                                .setColor('#e2574c')
                                .setTimestamp()
                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                            return message.reply({embeds: [embed]});
                        }
                        if (result.length > 0) {
                          if (result) {
                                if (!result[0].userid) {
                                    db.query('UPDATE licenses SET userid = ? WHERE license = ?', [message.member.id, args[1]], function (err) {
                                        if (err) {
                                            const embed = new client.discord.MessageEmbed()
                                                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                                .setDescription('A server-side error has occurred.')
                                                .setColor('#e2574c')
                                                .setTimestamp()
                                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                          
                                            return message.reply({embeds: [embed]});
                                        }
                                        const embed = new client.discord.MessageEmbed()
                                            .setAuthor('LICENSE REDEEMED!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                            .setDescription('Author: <@'+ message.author.id +'> \nThe key **'+ args[1] +'** was **successfully** redeemed!')
                                            .setColor('#9500ff')
                                            .setTimestamp()
                                            .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                        message.reply({embeds: [embed]});
                  
                                        const logriscarttata = new client.discord.MessageEmbed()
                                            .setAuthor('LICENSE REDEEMED!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                            .setDescription('Author: <@'+ message.author.id +'> \nKey: **'+ args[1] +'**')
                                            .setColor('#9500ff')
                                            .setTimestamp()
                                            .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                        message.guild.channels.cache.get(client.config.log.redeem).send({embeds: [logriscarttata]})
                                    });
                                }else{
                                    const embed = new client.discord.MessageEmbed()
                                        .setColor('#e2574c')
                                        .setTimestamp()
                                        .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                        .setDescription('This license has already been redeemed')
                                    return message.reply({embeds: [embed]});
                                }
                          }
                        }else{
                            const embed = new client.discord.MessageEmbed()
                                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                .setDescription('Invalid license!')
                                .setColor('#e2574c')
                                .setTimestamp()
                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                            return message.reply({embeds: [embed]});
                        }
                      });
                    break;
                case "status":
                    db.query('SELECT * FROM licenses WHERE userid = ?', [message.author.id], function (result) {
                        console.log(result.length)
                        if (result.length > 0)
                            if (result) {
                                var ciao = "";
                                for( var i = 0; i < result.length; i++){
                                    ciao += `Key: **${result[i].license}** \n Created by: **<@${result[i].created_by}>** \n Redeemed by: **<@${result[i].userid}>** \n Expires: **${result[i].total_time}**\n\n`
                                }
                                const tempodellelicenze = new client.discord.MessageEmbed()
                                    .setAuthor('License Duration!')
                                    .addField("License:", ciao)
                                    .setColor('BLUE')
                                    .setTimestamp()
                                    .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                                message.reply({embeds: [tempodellelicenze]});
                            }else{
                                const nolicenza = new client.discord.MessageEmbed()
                                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                .setDescription('**YOU DO NOT OWN A VALID LICENSE**')
                                .setColor('#e2574c')
                                .setTimestamp()
                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                            message.reply({embeds: [nolicenza]})
                            }
                        else{
                            const nolicenza = new client.discord.MessageEmbed()
                                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                .setDescription('**YOU DO NOT OWN A VALID LICENSE**')
                                .setColor('#e2574c')
                                .setTimestamp()
                                .setFooter(`Developed by fleb5`, "https://i.imgur.com/iLfyiXS.gif")
                            message.reply({embeds: [nolicenza]})
                        }
                    });
                    break;
            }
});
