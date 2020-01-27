#!/usr/bin/env node
import command from 'commander';
import {prompt} from 'inquirer';
// import {init as buildModelFile} from './modules/modelFiles';
import {create} from './create';

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter project name: ',
    default: 'graphql-boilerplat',
  },
];

command.version('1.0.0').description('Hello world');

command.command('new').description('Create a new project').action(async () => {
  const basicAnswer = await prompt(questions);
  // let model = [];
  // model = await basicQuestions(model);
  // await buildModelFile(basicAnswer);
  create({projectName: basicAnswer.projectName});
});

command.parse(process.argv);
