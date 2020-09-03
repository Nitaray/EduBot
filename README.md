# EduBot

## Overview

A discord bot to fetch updates from VNU-HCMIU's edusoftweb and post it on channels on discord.

## Dependencies

- [puppeteer](https://pptr.dev)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

## Getting Started

### Installation

```bash
git clone https://github.com/Nitaray/EduBot.git EduBot
cd EduBot
```

### Configuration

This Javascript project uses NodeJS. NodeJS and Node Package Manager can be downloaded and installed from [here](https://nodejs.org) if not installed already.
The dependenencies can be installed via the command `npm install`.

Once the installation is completed, create a new file named `.env` with the following content:

```.env
# Token of the discord bot
BOT_TOKEN=<your-discord-bot-token>
# Path to the local channel ids file
CHANNELS_ID_FILE_PATH=channels.txt
# Path to the local screenshot directory
SCREENSHOTS_DIR_PATH='./screenshots/'
# The interval between each announcement check (in minutes)
CHECK_INTERVAL=15
# Link to the announcement site of edusoft
EDUSOFT_ANNOUNCEMENT_LINK='http://edusoftweb.hcmiu.edu.vn/default.aspx?page=chitietthongtin&id='
# Link to the announcement site logo
EDUSOFT_LOGO_LINK='http://edusoftweb.hcmiu.edu.vn/Images/Edusoft.gif'
# The starting announcement number (based on the announcement site)
STARTING_ANNOUNCEMENT_NUMBER=1000
```

These are the enviroment variables required for the bot to work. These variables can be changed to suit the usage.

Discord bot token can be retrieved at the discord developer portal after the bot has been created and registered. Please refer to discord documentation [here](https://discord.js.org/#/docs/main/stable/general/welcome).

### Execution

Once all dependencies are installed, the bot can be run using:

```bash
node edubot.js
```

## Features

The bot will push new annoucement from VNU-HCMIU's edusoftweb to specified Discord channels. It will check for update once every 15 minutes by default (can be changed in `.env` file).

### Commands

- **Admin-only commands**:
  
  - `.restart`: Restart the bot.
  - `.addchannel`: Add the current channel to the announcement list.
  - `.removechannel`: Remove the current channel from the announcement list.

- **Others**: WIP.