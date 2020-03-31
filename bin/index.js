#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const fromJSON = require('./fromJSON');
program.version('0.0.1')
.option('--JSON <path>', 'Path to JSON file')
.parse(process.argv);
console.log(program.JSON);

fromJSON.init(program.JSON)