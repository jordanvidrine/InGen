const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const MarkdownIt = require('markdown-it')();

const { getSectionContent, getPageContent } = require('./helpers/content')
const { cleanOut, createSiteDir } = require('./helpers/cleaner')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping '<' and '>' tags in html for some reason
Mustache.escape = function(text) {return text;};

async function build(dirPath) {

  try {
    let dirContent = fs.readdirSync(dirPath)
    let filesToRender = [];

    let sections = await getSectionContent();

    // loop over directory content to add .md files to filesToRender array
    for (let i = 0; i < dirContent.length ; i++) {
      let isMarkDown = /(.md)$/.test(dirContent[i])
      if (isMarkDown) {
        filesToRender.push(`${dirPath}/${dirContent[i]}`)
      }
    }

    let pages = [];
    // Renders output of each page in the pages array, also stores the
    // filename to be used, and the stylesheet used
    for (let j = 0; j < filesToRender.length; j++) {
      let page = await getPageContent(filesToRender[j])
      let view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`
      }

      let template = await fsPromises.readFile(page.options.template, 'utf8');

      let fileName = filesToRender[j].split('/')[filesToRender[j].split('/').length-1].split('.')[0]+ '.html';

      let filePath = `./_site/${fileName}`

      let output = Mustache.render(template,{...view, sections})

      pages.push({
        output, filePath,"stylesheet" : page.options.style,
      })
    }

    // clear _site and recreate it
    if (fs.existsSync('./_site')) {
      cleanOut('./_site')
    }
    await createSiteDir('./_site')

    // loop over pages and saves the output of each to an html file
    // as well as saves a css file for each one used
    for (let k = 0; k < pages.length; k++) {
      // save the rendered output to an html file
      await fsPromises.writeFile(pages[k].filePath, pages[k].output, 'utf8')
      let cssDir = fs.readdirSync(`./_site/assets/css`)
      // only copy css files if they are not already in the _site/assets/css dir
      if (!cssDir.includes(`${pages[k].stylesheet}.css`)) {
        await fsPromises.copyFile(`./templates/css/${pages[k].stylesheet}.css`, `_site/assets/css/${pages[k].stylesheet}.css`)
      }
    }

  } catch (e) {
    console.log(e)
  }
}

// will build site from content in the /content directory
// all files to be rendered must be in the root of /content and be an .MD file
build('./content')
