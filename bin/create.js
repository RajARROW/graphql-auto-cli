const fs = require('fs');

module.exports = async (name) => {
    fs.writeFile('mynewfile.js', `HEllow world ${name}`, (err) => {
        if (err) throw err;

        console.info("The file was succesfully saved!");
    }); 
};