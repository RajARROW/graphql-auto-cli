#!/usr/bin/env node
const create = require('./create.js')
const command = require('commander');

command.version('1.0.0').description('Hello world');

command.command('new <name>').description('Create a new project').action(async (name) => {
    console.info(await create(name));
});

command.parse(process.argv)