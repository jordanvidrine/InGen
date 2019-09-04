const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const MarkdownIt = require('markdown-it')();

const getData = require('./helpers/getData')
const getSectionContent = require('./helpers/getSectionContent')
const { cleanOut, createSiteDir } = require('./helpers/cleanout')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping < and > tags in html for some reason
Mustache.escape = function(text) {return text;};

async function build(path) {
  try {
    let data = await getData(path);
    // setting view to be the content and any options present from the md file
    // this contains the data that will be injected into the handlebars template
    // used to generate the html
    let view = {
      title: data.options.title,
      content: data.pageContent,
      // save the style to the actual location in the built site directory
      // will be inserted into the generated html as a stylesheet link
      style: `./assets/css/${data.options.style}.css`,
      sections: data.sections
    }

    // get the template content
    let template = await fsPromises.readFile(data.options.template, 'utf8')

    // render the page using the template and the view
    let output = Mustache.render(template, view)

    // clear _site and recreate it
    if (fs.existsSync('./_test-site')) {
      cleanOut('./_test-site')
    }

    await createSiteDir('./_test-site')

    // save the rendered output to an html file
    await fsPromises.writeFile(`_test-site/${path.split('/')[path.split('/').length-1].split('.')[0]}.html`,output, 'utf8')

    // copy the css stylesheet chosen into the css folder
    await fsPromises.copyFile(`./templates/css/${data.options.style}.css`, `_test-site/assets/css/${data.options.style}.css`)
  } catch(e) {
    console.log(e)
  }

}

let filePath = path.join(__dirname, '../content') + '/index.md'

build(filePath)
