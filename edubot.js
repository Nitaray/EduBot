const Discord = require('discord.js');
const fs = require('fs');
const load_channels = require('./load_channels.js');
const save_channels = require('./save_channels.js');
const get_announement = require('./get_announements.js');
const prepare_message = require('./prepare_message.js');
const { exit } = require('process');
require('dotenv').config()

const botClient = new Discord.Client();

const token = process.env.BOT_TOKEN;
const channelsPath = process.env.CHANNELS_ID_FILE_PATH;

var channelsID = new Set();
var announcementNumber = process.env.STARTING_ANNOUNCEMENT_NUMBER;

const checkInterval = process.env.CHECK_INTERVAL * 60 * 1000;

function checkDirIntegrity() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('.env')) {
            reject('Please create a .env with appropriate values as shown in the README.md file!');
            return;
        }
        if (!fs.existsSync(channelsPath)) {
            try {
                fs.openSync(filePath, 'a');
                console.log('Created a file to store channel ids!');
            } catch(err) {
                console.error(err);
                reject('Error encountered while trying to create a file!');
                return;
            }
        }
        if (!fs.existsSync(process.env.SCREENSHOTS_DIR_PATH))
            fs.mkdir(SCREENSHOTS_DIR_PATH, (err) => {
                if (err) {
                    console.error(err);
                    reject('Error encounterd while trying to create a folder');
                    return;
                }
                else
                    console.log('Created a folder to store screenshots!');
            })
        resolve('Directory integrity is good to start!');
    })
}

function restartBot(channel) {
    channel.send('Restarting...')
        .then(() => botClient.destroy())
        .then(() => startBot());
}

function startBot() {
    return botClient.login(token);
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

function addChannel(channel) {
    if (!channelsID.has(channel.id)) {
        channelsID.push(channel.id);
        save_channels(channelsPath, channelsID);
        console.log('Added a channel with id ' + channel.id);
        channel.send('Successfully added this channel to the announcement list!');
    } else {
        channel.send('This channel is already in the announcement list!');
        console.log('Tried adding an existing channel ID.');
    }
}

function removeChannel(channel) {
    if (channelsID.has(channel.id)) {
        channelsID.delete(channel.id);
        save_channels(channelsPath, channelsID);
        console.log('Removed a channel with id ' + channel.id);
        channel.send('Successfully removed this channel from the announcement list!');
    } else {
        channel.send('This channel is not in the announcement list!');
        console.log('Tried removing a non-existing channel ID.');
    }
}

function rejectAdminCommand(message) {
    message.reply('this is an admin-only command!');
}

botClient.on('message', msg => {
    switch (msg.content.toLowerCase()) {
        case '.restart':
            if (msg.member.hasPermission('ADMINISTRATOR'))
                restartBot(msg.channel)
            else 
                rejectAdminCommand(msg);
            break;
        case '.addchannel':
            if (msg.member.hasPermission('ADMINISTRATOR'))
                addChannel(msg.channel);
            else 
                rejectAdminCommand(msg);
            break;
        case '.removechannel':
            if (msg.member.hasPermission('ADMINISTRATOR'))
                removeChannel(msg.channel);
            else
                rejectAdminCommand(msg);
            break;
        case '.konami':
            msg.reply(`The next annoucement number is ${announcementNumber}`);
            break;
    }
})

botClient.on('ready', () => {
    console.log("EduBot Online!");
    channelsID = new Set(load_channels(channelsPath));
    setInterval(checkAnnounement, checkInterval);
    checkAnnounement();
})

checkDirIntegrity().then((resolvemsg) => {
    console.log(resolvemsg);
    startBot();
}, (errormsg) => {
    console.error(errormsg);
    exit(1);
});