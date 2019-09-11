const Mustache = require('mustache')
const fs = require('fs-extra')
const path = require('path')
const MarkdownIt = require('markdown-it')();
const server = require('./server')

const skeleton = require('./helpers/skeleton')
const {assemblePages, savePosts} = require('./helpers/assembly')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping '<' and '>' tags in html for some reason
Mustache.escape = function(text) {return text;};

async function build(dirPath) {

  try {
    let dirContent = fs.readdirSync(dirPath)
    let filesToRender = [];

    // loop over content to add .md files to filesToRender array
    for (let file of dirContent) {
      let isMarkDown = /(.md)$/.test(file)
      if (isMarkDown) {
        filesToRender.push(`${dirPath}/${file}`)
      }
    }

    let pages = await assemblePages(filesToRender)

    await fs.emptyDir('./_site');

    await skeleton();

    // loop over pages and save the output of each to an html file
    for (let page of pages) {
      await fs.outputFile(page.filePath, page.output, {flag:'w+'})
    }

    //await savePosts()

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
