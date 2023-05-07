const fs = require('fs/promises');
const path = require('path');

const pathToDir = __dirname;
const fromDir = 'styles';
const toDir = 'project-dist';
const sourceDir = path.join(pathToDir, fromDir);
const destDir = path.join(pathToDir, toDir);

(async function(source, dest) {
  try {
    let data = [];
    const files = await fs.readdir(source, {withFileTypes: true});
    const arrOfName = files.filter(x => x.isFile());
        
    for (const item of arrOfName) {
      let ext = path.extname(item.name);
      if (ext === '.css') {
        data.push(await fs.readFile(path.join(source, item.name), 'utf8'));
      }  
    }
    await fs.writeFile(path.join(dest, 'bundle.css'), data.join('\n'));
  } catch (err) {
    console.error(err);
  } 
}) (sourceDir, destDir);