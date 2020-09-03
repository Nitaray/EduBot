const Discord = require('discord.js');
const fs = require('fs');
const load_channels = require('./load_channels.js');
const save_channels = require('./save_channels.js');
const get_announement = require('./get_announements.js');
require('dotenv').config()

const botClient = new Discord.Client();

const token = process.env.BOT_TOKEN;
const channelsPath = process.env.CHANNELS_ID_FILE_PATH;

var channelsID = [];

const checkInterval = 60 * 60 * 1000;

botClient.on('ready', () => {
    console.log('EduBot online!');

    channelsID = getChannelIDs(channelsPath);
    console.log('Announcement channels:');
    console.log(channelsID);
})

botClient.on('message', msg => {
    switch(msg.content.toLowerCase()) {
        case '.restart':
            restartBot(msg.channel)
            break;
        case '.addchannel':
            addChannel(msg.guild, msg.channel);
            break;
    }
})

function restartBot(channel) {
    channel.send('Restarting...')
        .then(() => botClient.destroy())
        .then(() => startBot());
}

function startBot() {
    return botClient.login(token);
}

function getChannelIDs(filePath) {
    try {
        if (!fs.existsSync(filePath))
            fs.openSync(filePath, 'a');
        return load_channels(filePath);
    }
    catch(err) {
        console.error(err);
    }
}

function announce(announcement) {
    channelsID.forEach((id) => {
        try {
            let channel = botClient.channels.cache.get(id);
            channel.send(announcement);

        } catch(err) {
            console.log(`Something went wrong while trying to announce to channel ${id}.`);
            console.error(err);
        }

    });
    console.log(`Announced new message at ${new Date().getTime()}`);
}

function addChannel(guild, channel) {
    if (!channelsID.find((id) => id == guild.id + channel.id)) {
        channelsID.push(guild.id + channel.id);
        save_channels(channelsPath, channelsID);
        console.log('Added a channel with id ' + guild.id + channel.id);
        channel.send('Successfully added this channel to the announcement list!');
    } else {
        channel.send('This channel is already in the announcement list!');
        console.log('Tried adding an existing channel ID.');
    }
}

startBot();