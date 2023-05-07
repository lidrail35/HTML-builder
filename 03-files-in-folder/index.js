const path = require('path');
const readDir = require('fs/promises');

(async function(pathToDir, dir) {
  try {
    const files = await readDir.readdir(path.join(pathToDir, dir), {withFileTypes: true});
    const arrOfName = files.filter(x => x.isFile());

    for (const item of arrOfName) {
      const fullPath = path.join(pathToDir, dir, item.name);
      const info = await readDir.stat(fullPath);
      let ext = path.extname(item.name);
      let fileName = path.basename(item.name, ext);
      let fileSize = info.size / 1000;
      console.log( `${fileName} - ${ext.slice(1)} - ${fileSize}kB`);
    }
  } catch (err) {
    console.error(err);
  }
}) (__dirname, 'secret-folder');
