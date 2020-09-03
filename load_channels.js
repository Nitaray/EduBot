const fs = require('fs');

module.exports = (filename) => {
    return fs.readFileSync(filename, 'utf-8').toString().split('\r\n');
} 