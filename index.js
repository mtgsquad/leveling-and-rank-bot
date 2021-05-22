const { token, prefix } = require('./config.json');
const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Client();
const Canvacord = require('canvacord');
const db = require('quick.db');
const { author } = require('canvacord');

client.on('ready', () => console.log('Bot is up and running!'));

client.on("message", async (message, guild) => {
    if(message.content === `${prefix}help`) {
        const helpEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Help Command')
        .addFields(
            {name: '?rank', value: 'The rank command'}
        )
        .setFooter('Bot Made By MTGSquad');

        message.channel.send(helpEmbed);
    }

    xp(message)
    if(message.content.startsWith(`${prefix}rank`)) {
    if(message.author.bot) return;
    var user = message.mentions.users.first() || message.author;
    var level = db.fetch(`guild_${message.guild.id}_level_${user.id}`) || 0;
    var currentxp = db.fetch(`guild_${message.guild.id}_xp_${user.id}`) || 0;
    var xpNeeded = level * 500 + 500 // 500 + 1000 + 1500
    const rankcard = new Canvacord.Rank()
        .setAvatar(user.displayAvatarURL({format: 'png', dynamic: true}))
        .setCurrentXP(db.fetch(`guild_${message.guild.id}_xp_${user.id}`) || 0)
        .setRequiredXP(xpNeeded)
        .setStatus(user.presence.status)
        .setLevel(db.fetch(`guild_${message.guild.id}_level_${user.id}`) || 0)
        .setRank(1, 'RANK', false)
        .setProgressBar("#a81d16", "COLOR")
        .setOverlay("#000000")
        .setUsername(user.username)
        .setDiscriminator(user.discriminator)
        .setBackground("COLOR", "#808080")
        rankcard.build()
        .then(data => {
            const atta = new MessageAttachment(data, "rank.png")
            message.channel.send(atta)
        })
    }

    function xp(message) {
        if(message.author.bot) return
        const randomNumber = Math.floor(Math.random() * 10) + 15;
        db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber) 
        db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber)
        var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1
        var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`)
        var xpNeeded = level * 500;
        if(xpNeeded < xp){
            var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1) 
            db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
            message.channel.send(`Congrats ${message.author}, you leveled up, you are now level ${newLevel}`)
        }
    }
    

})

client.login(token);