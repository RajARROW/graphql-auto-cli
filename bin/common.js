/* eslint-disable max-len */
import {outputFile} from 'fs-extra';

export const writeFile = (data, fileName) => {
  outputFile(fileName, data, (err) => {
    if (err) {
      console.info('Error writing file', err);
    } else {
      console.info('Successfully wrote file');
    }
  });
};
