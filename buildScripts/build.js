const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const MarkdownIt = require('markdown-it')();

const { getSectionContent, getPosts } = require('./helpers/content')
const {buildSkeleton} = require('./helpers/copyAssets')
const {cleanOut} = require('./helpers/cleaner')
const {assemblePages, savePosts} = require('./helpers/assembly')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping '<' and '>' tags in html for some reason
Mustache.escape = function(text) {return text;};

async function build(dirPath) {

  try {
    let dirContent = fs.readdirSync(dirPath)
    let filesToRender = [];

    // loop over content to add .md files to filesToRender array
    for (let i = 0; i < dirContent.length ; i++) {
      let isMarkDown = /(.md)$/.test(dirContent[i])
      if (isMarkDown) {
        filesToRender.push(`${dirPath}/${dirContent[i]}`)
      }
    }

    let pages = await assemblePages(filesToRender)

    await buildSkeleton();

    // loop over pages and save the output of each to an html file
    for (let k = 0; k < pages.length; k++) {
      fs.writeFile(pages[k].filePath, pages[k].output, (err) => {
        if (err) throw err;
        console.log('File written')
      })
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
