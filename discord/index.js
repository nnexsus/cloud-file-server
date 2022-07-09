const { token, prefix } = require('./config.json');
const { Client, Intents, MessageAttachment, MessageEmbed, MessageButton } = require('discord.js');
const { default: axios } = require('axios');
const { Pagination } = require('pagination.djs');

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]})

client.once('ready', () => {
    console.log('Bot Ready.');
})

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith("!")) return;

    if (message.content.startsWith(`${prefix}save`)) {
        const img = await message.channel.messages.fetch(message.reference.messageId)
        var attachment = ''
        if (img.attachments.first().proxyURL) {
            attachment = (img.attachments.first().proxyURL)
        } else {
            img.embeds.forEach((embed) => {
                attachment = embed.url
            })
        }
        const author = await ((message.author.username) + "-" + (message.author.discriminator))
        const server = await message.guild.name
        const serverid = await message.guild.id
        const customname = message.content.slice(5).trim();
        console.log(img)
        console.log(img.attachments.first())
        const data = {
            "file": attachment,
            "author": author,
            "server": server,
            "serverid": serverid,
            "customname": customname
        }
        const res = await axios.post("http://localhost:3001/api/create/discord", data, {headers: {'content-type': "multipart/form-data"}}).then((response) => {
            message.reply("Image saved.")
        }).catch((e) => {
            message.reply(e.message)
        })


    } else if (message.content.startsWith(`${prefix}get`)) {


        const customname = message.content.slice(4).trim()
        axios.get(`http://localhost:3001/api/get/discord/${customname}`).then((response) => {
            console.log(response.data)
            response.data.map((dat) => {
                console.log(dat)
                const filename = dat.filename
                message.reply(`${filename}`)
            })
        }).catch((e) => {
            message.reply(e)
        })



    } else if (message.content.startsWith(`${prefix}test`)) {
        console.log(message.author.username)


    } else if (message.content.startsWith(`${prefix}server`)) {


        const author = await message.author.username + "-" + message.author.discriminator
        const server = await message.guild.name
        const data = {
            "server": server,
            "author": author
        }

        axios.post(`http://localhost:3001/api/get/discordserveruser`, data).then((response) => {
            console.log(response.data)
            response.data.map((dat) => {
                console.log(dat)
                const filename = dat.filename
                message.reply(`${filename}`)
            })
        })


    } else if (message.content.startsWith(`${prefix}server`)) {


        const server = await message.guild.name
        const data = {
            "server": server
        }
        axios.post(`http://localhost:3001/api/get/discordserver`, data).then((response) => {
            console.log(response.data)
            response.data.map((dat) => {
                console.log(dat)
                const filename = dat.filename
                message.reply(`${filename}`)
            })
        })
    }
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'user') {
        const pagination = new Pagination(interaction);

        const pages = []

        const author = await interaction.user.username + "-" + interaction.user.discriminator
        const res = await axios.get(`http://localhost:3001/api/get/discorduser/${author}`).then((response) => {
            response.data.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.customname}`)
                .setImage(dat.filename)
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.render()
        })


    } else if (interaction.commandName === 'server') {
        const pagination = new Pagination(interaction);

        const pages = []

        const server = await interaction.guild.id
        const data = {
            "server": server
        }
        const res = await axios.post(`http://localhost:3001/api/get/discordserver`, data).then((response) => {
            response.data.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.customname}`)
                .setImage(dat.filename)
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.render()
        })


    } else if (interaction.commandName === 'serveruser') {
        const pagination = new Pagination(interaction);

        const pages = []

        const server = await interaction.guild.id
        const author = await interaction.user.username + "-" + interaction.user.discriminator
        const data = {
            "server": server,
            "author": author
        }
        const res = await axios.post(`http://localhost:3001/api/get/discordserveruser`, data).then((response) => {
            response.data.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.customname}`)
                .setImage(dat.filename)
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.render()
        })


    } else if (interaction.commandName === 'random') {


        const pagination = new Pagination(interaction);

        const pages = []

        const res = await axios.get(`http://localhost:3001/api/getall/discordrand`).then((response) => {
            response.data.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.customname}`)
                .setImage(dat.filename)
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
                pages.push(embed)
            })
            pagination.setEmbeds(pages)
            pagination.render()
        })


    } else if (interaction.commandName === 'help') {
        const embed = new MessageEmbed()
            .setTitle(`Help`)
            .addField('')
            .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
        interaction.reply({embeds: [embed]})
    }
})


client.login(token);