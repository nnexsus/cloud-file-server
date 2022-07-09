const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10')
const { token, clientID, guildID } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('save').setDescription('Save files usto the nnexsus-cloud-servers. Syntax: reply to img with - **!save [customname].**'),
    new SlashCommandBuilder().setName('get').setDescription('Get saved files from the cloud. Syntax: **!get [customname].**'),
    new SlashCommandBuilder().setName('user').setDescription("Get all files you've saved."),
    new SlashCommandBuilder().setName('server').setDescription("Get all files saved in your current server."),
    new SlashCommandBuilder().setName('random').setDescription("Yoink a completly random file from somehwere."),
    new SlashCommandBuilder().setName('help').setDescription("Get all command info and syntaxes.")
]

const rest = new REST({version: '10'}).setToken(token)

rest.put(Routes.applicationCommands(clientID), {body: commands}).then(() => {
    console.log('Commands registered globally.')
}).catch(console.error)

rest.put(Routes.applicationGuildCommands(clientID, guildID), {body: commands}).then(() => {
    console.log('Commands registered.')
}).catch(console.error)