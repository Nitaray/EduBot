const fs = require('fs');

module.exports = (filename, channelsID) => {
    let data = "";
    channelsID.forEach((element) => data += element + '\r\n');
    fs.writeFileSync(filename, data);
    return data;
}