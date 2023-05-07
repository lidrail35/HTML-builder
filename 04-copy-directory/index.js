const path = require('path');
const file = require('fs/promises');

const pathToDir = __dirname;
const fromDir = 'files';
const sourceDir = path.join(pathToDir, fromDir);
const destDir = path.join(pathToDir, `${fromDir}-copy`);
console.log(sourceDir);
console.log(destDir);

function copyDir(source, dest) {
  file.rm(dest, {force: true, recursive :true})
    .then(() => {file.mkdir(dest);})
    .then(() => file.readdir(source, {withFileTypes: true}))
    .then((data) => {
      data.forEach((item => {
        if (item.isDirectory()) {
          copyDir(path.join(source, item.name), path.join(dest, item.name));
        } else {
          let sourceFile = path.join(source, item.name);
          let destFile = path.join(dest, item.name);
          file.copyFile(sourceFile, destFile);
        }
      }));
    })
    .catch(err => console.log(err));
}

copyDir(sourceDir, destDir);