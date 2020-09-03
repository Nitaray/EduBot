const Discord = require('discord.js');
require('dotenv').config();

module.exports = (announementData) => {
    const embedMessage = new Discord.MessageEmbed();
    embedMessage.setColor('#00ffee');
    embedMessage.setAuthor('Edusoft Bot by Nitaray', process.env.EDUSOFT_LOGO_LINK, 'https://github.com/Nitaray/EduBot');
    embedMessage.setTitle(announementData[0]);
    embedMessage.setURL(announementData[2]);
    embedMessage.setDescription(announementData[1]);
    embedMessage.setThumbnail(process.env.EDUSOFT_LOGO_LINK);
    embedMessage.attachFiles(announementData[3]);
    embedMessage.setImage(`attachment://${announementData[4]}`);
    return embedMessage;
}