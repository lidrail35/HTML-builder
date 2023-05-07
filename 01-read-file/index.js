const fs = require('fs');

const readFile = fs.createReadStream('./01-read-file/text.txt', 'utf-8');
readFile.on('data', chunk => console.log(chunk));

