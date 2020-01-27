// const fs = require('fs-extra');
// const baseDir = path.join(__dirname, '/.//');
// path.join(__dirname,"niktoResults","result.txt"
import {init as createBasicFile} from './modules/basicFiles';
import {init as createModelFile} from './modules/modelFiles';


export const create = async (data) => {
  await createBasicFile(data.projectName);
  await createModelFile();
  // fs.outputFile('./home/mynewfile.js', `HEllow world`, (err) => {
  //     if (err) throw err;

  //     console.info("The file was succesfully saved!");
  // });
};
