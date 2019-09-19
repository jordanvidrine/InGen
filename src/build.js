const fs = require('fs-extra')
const path = require('path')
const server = require('./server')

const skeleton = require('./helpers/skeleton')
const assemblePages = require('./helpers/assemblePages')
const savePosts = require('./helpers/savePosts')
const buildBlog = require('./helpers/buildBlog')

async function build(dirPath) {

  try {
    let dirContent = fs.readdirSync(dirPath)
    let filesToRender = [];
    let blog = null;

    // loop over content to add .md files to filesToRender array
    for (let file of dirContent) {
      let isMarkDown = /(.md)$/.test(file)
      if (isMarkDown) {
        // if it is the blog page, do not add it to filesToRender, blog will render separately
        if (file !== 'blog.md') filesToRender.push(`${dirPath}/${file}`)
        else blog = file;
      }
    }

    let pages = await assemblePages(filesToRender)

    await fs.emptyDir('./_site');

    await skeleton();

    // loop over pages and save the output of each to an html file
    for (let page of pages) {
      // save blog page to blog/index.html
      if (page.filePath === './_site/blog.html') page.filePath = './_site/blog/index.html'
      await fs.outputFile(page.filePath, page.output, {flag:'w+'})
    }

    if (blog) {
      await buildBlog(blog)
    }

    // save posts to the _site/blog folder in corresponding locations
    await savePosts()

  } catch (e) {
    console.log(e)
  }
}

// will build site from content in the /content directory
// all files to be rendered must be in the root of /content and be an .MD file
build('./content')
