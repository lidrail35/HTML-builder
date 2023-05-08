const fs = require('fs/promises');
const path = require('path');


const fromTemplate = path.join(__dirname, 'assets');
const toProject = path.join(__dirname, 'project-dist');
const toProjectAssets = path.join(toProject, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const stylePath = path.join(__dirname, 'styles');
const componentPath = path.join(__dirname, 'components');

function getHtmlTemplate(templatePath) {
  return fs.readFile(templatePath, 'utf8');
}

function getArrayTemplateTag(htmlTemplate) {
  return [htmlTemplate, htmlTemplate.match(/{{(.*?)}}/g)];
}

async function changeHtmlTemplate([htmlTemplate, arrayTemplateTag], componentPath) {
  const arrTag = arrayTemplateTag.map(x => x.slice(2).slice(0, -2));
  
  for (let componentFile of arrTag) {
    let fileName = `${componentFile}.html`;
    let itemTemplate = await fs.readFile(path.join(componentPath, fileName), 'utf8');
    htmlTemplate = htmlTemplate.replace(`{{${componentFile}}}`, itemTemplate);
  }
  return htmlTemplate;
}

async function saveHTML(toProject, htmlText) {
  await fs.writeFile(path.join(toProject, 'index.html'), htmlText);
}

function copyDir(source, dest) {
  fs.mkdir(dest)
    .then(() => fs.readdir(source, {withFileTypes: true}))
    .then((data) => {
      for (let item of data) {
        if (item.isDirectory()) {
          copyDir(path.join(source, item.name), path.join(dest, item.name));
        } else {
          let sourceFile = path.join(source, item.name);
          let destFile = path.join(dest, item.name);
          fs.copyFile(sourceFile, destFile);
        }
      }
    })
    .catch(err => console.log('Error', err));
}

function verifyDir(dest) {
  return new Promise((resolve) => {
    resolve(fs.rm(dest, {force: true, recursive :true}));
  });  
}

async function copyCSS(source, dest) {
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
    await fs.writeFile(path.join(dest, 'style.css'), data.join('\n'));
  } catch (err) {
    console.error(err);
  } 
}

verifyDir(toProject)
  .then(() => fs.mkdir(toProject))
  .then(() => copyDir(fromTemplate, toProjectAssets))
  .then(() => getHtmlTemplate(templatePath))
  .then(htmlTemplate => getArrayTemplateTag(htmlTemplate))
  .then(arrayTemplate => changeHtmlTemplate(arrayTemplate, componentPath))
  .then(htmlText => saveHTML(toProject, htmlText))
  .then(() => copyCSS(stylePath, toProject))
  .catch(err => console.log(err));
