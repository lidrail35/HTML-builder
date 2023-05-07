const fs = require('fs');

const output = fs.createWriteStream('./02-write-file/destination.txt');

const { stdin, stdout } = process;
stdout.write('Hello, my dear friend!\n');

stdin.on('data', data => ( (data.indexOf('exit') === -1) ? output.write(data) : process.exit() ) );
process.on('exit', () => stdout.write('Good by!'));
process.on('SIGINT', () => process.exit());
