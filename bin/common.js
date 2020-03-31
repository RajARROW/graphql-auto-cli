const fs = require('fs');
module.exports.writeFile = (name, data) => {
    fs.writeFile(name, data, (err) => {
        if (err) throw err;
        console.log(`Created ${name} file.`);
    });
}

module.exports.writeFileWithFolderPath = (dir, fileName, data) => {
    // if (!fs.existsSync(dir)){
    //     fs.mkdirSync(dir);
    // }
    // this.writeFile('./server/index.js', data);
    // mkdirp(getDirName(dir),(err) => {
    //     if (err) throw err;
    //     fs.writeFile(dir, data);
    //   });
    fs.mkdirSync(dir, { recursive: true });
    this.writeFile(dir + fileName, data);
}

module.exports.writeFileIfExist = async (dir, fileName, data) => {
    console.log(fs.existsSync(dir + fileName));
    if (fs.existsSync(dir + fileName)){
        await fs.appendFile(dir + fileName, data , (err)=> {
            if (err) throw err;
            console.log(`Edited ${fileName} file.`);
        });
    } else {
        this.writeFileWithFolderPath(dir, fileName, data);
    }
}