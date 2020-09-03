const Discord = require('discord.js');
const fs = require('fs');
const load_channels = require('./load_channels.js');
const save_channels = require('./save_channels.js');
const get_announement = require('./get_announements.js');
const prepare_message = require('./prepare_message.js');
require('dotenv').config()

const botClient = new Discord.Client();

const token = process.env.BOT_TOKEN;
const channelsPath = process.env.CHANNELS_ID_FILE_PATH;

var channelsID = [];
var announcementNumber = process.env.STARTING_ANNOUNCEMENT_NUMBER;

const checkInterval = 60 * 60 * 1000;

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

function checkAnnounement() {
    let announcement = get_announement(process.env.EDUSOFT_ANNOUNCEMENT_LINK, announcementNumber);
    announcement.then((announcementData) => announce(prepare_message(announcementData)), (rejectMessage) => console.log(rejectMessage));
}

function announce(announcement) {
    announcementNumber++;

    channelsID.forEach((id) => {
        if (id) {
            try {
                let channel = botClient.channels.cache.get(id);
                channel.send(announcement);
    
            } catch(err) {
                console.log(`Something went wrong while trying to announce to channel ${id}.`);
                console.error(err);
            }
        }

    });
    console.log(`Announced new message at ${new Date()}`);
}

function addChannel(guild, channel) {
    if (!channelsID.find((id) => id == channel.id)) {
        channelsID.push(channel.id);
        save_channels(channelsPath, channelsID);
        console.log('Added a channel with id ' + channel.id);
        channel.send('Successfully added this channel to the announcement list!');
    } else {
        channel.send('This channel is already in the announcement list!');
        console.log('Tried adding an existing channel ID.');
    }
}

botClient.on('message', msg => {
    switch (msg.content.toLowerCase()) {
        case '.restart':
            restartBot(msg.channel)
            break;
        case '.addchannel':
            addChannel(msg.guild, msg.channel);
            break;
    }
})

botClient.on('ready', () => {
    console.log("EduBot Online!");
    channelsID = getChannelIDs(channelsPath);
    setInterval(checkAnnounement, checkInterval);
    checkAnnounement();
    console.log(channelsID);
})

startBot();