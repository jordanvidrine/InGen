const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const MarkdownIt = require('markdown-it')();

const { getSectionContent, getPageContent, getPosts } = require('./helpers/content')
const { cleanOut, createSiteDir } = require('./helpers/cleaner')
const assemblePages = require('./helpers/assembly')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping '<' and '>' tags in html for some reason
Mustache.escape = function(text) {return text;};

async function build(dirPath) {

  try {
    // reads the content of the directory build is called on
    let dirContent = fs.readdirSync(dirPath)

    // this array will hold the markdown files to be rendered
    let filesToRender = [];

    let sections = await getSectionContent();
    let posts = await getPosts();

    // loop over directory content to add .md files to filesToRender array
    for (let i = 0; i < dirContent.length ; i++) {
      let isMarkDown = /(.md)$/.test(dirContent[i])
      if (isMarkDown) {
        filesToRender.push(`${dirPath}/${dirContent[i]}`)
      }
    }

    let pages = await assemblePages(filesToRender, sections, posts)

    // clear _site and recreate it
    if (fs.existsSync('./_site')) {
      cleanOut('./_site')
    }
    await createSiteDir('./_site')

    // loop over pages and save the output of each to an html file
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

    // loop over posts and save the output to _site/_posts folder dependent on month created
    // for (let l = 0; l < posts.length; l++) {
    //   await fsPromises.writeFile()
    // }
    // console.log(posts)

  } catch (e) {
    console.log(e)
  }
}

// will build site from content in the /content directory
// all files to be rendered must be in the root of /content and be an .MD file
build('./content')
