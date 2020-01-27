import {writeFile} from '../common';
import {prompt} from 'inquirer';
// import {create} from '../create';

const collectInputs = async (inputs = []) => {
  const prompts = [
    {
      type: 'input',
      name: 'property',
      message: 'Enter property name: ',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Enter property type: ',
      choices: ['String', 'int', 'array', 'object'],
    },
    {
      type: 'confirm',
      name: 'again',
      message: 'Enter another input? ',
      default: true,
    },
  ];
  const {again, ...answers} = await prompt(prompts);
  const newInputs = [...inputs, answers];
  return again ? collectInputs(newInputs) : newInputs;
};

/**
 * Create Model files.
 * @param {any} data Data to write.
 * @param {any} fileName The second number.
 * @return {boolean} was funtion success or not.
 */
const createModelFiles = (data, fileName) => {
  const schema = JSON.stringify(data, null, 4);
  const dataToWrite = `const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const ${fileName}Schema = new Schema(
      ${schema}
    );
    export default mongoose.model('${fileName}', ${fileName}Schema);`;
  writeFile(dataToWrite, `./models/${fileName}.js`);
  return true;
};

export const basicQuestions = async (model) => {
  let isNewModel;
  do {
    const g = await prompt([{
      type: 'input',
      name: 'modelName',
      message: 'Enter model name: ',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          return 'Required Field';
        }
      },
    }]);
    const inputs = await collectInputs();
    model.push({modelName: g.modelName, fields: inputs});
    isNewModel = await prompt([{
      type: 'confirm',
      name: 'again',
      message: 'Enter another Model? ',
      default: true,
    }]);
  } while (isNewModel.again);
  return model;
};

export const init = async () => {
  const data = await basicQuestions([]);
  console.log(data);
  data.model.forEach((modelData) => {
    let scemas = {};
    modelData.fields.forEach(async (field) => {
      if (field.type === 'object') {
        return init();
      }
      const temp = {[field.property]: {type: field.type, required: false}};
      scemas = {...scemas, ...temp};
    });
    createModelFiles(scemas, modelData.modelName);
  });
};
