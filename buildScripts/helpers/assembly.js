const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises

const { getSectionContent, getPageContent, getPosts } = require('./content')

let assemblePages = async function(filesToRender, sections, posts) {

  let pagesArray = [];

  // Renders output of each page in the pages array, also stores the
  // filename to be used, and the stylesheet used
  for (let i = 0; i < filesToRender.length; i++) {
    let view;
    let page = await getPageContent(filesToRender[i])
    // if page had blog option set to true
    if (page.options.blog) {
      let maxPosts = page.options.maxPosts || 5
      view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`,
        posts: Array.from(posts).splice(0,maxPosts)
      }
    } else {
      view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`
      }
    }
    
    let template = await fsPromises.readFile(page.options.template, 'utf8');

    let fileName = filesToRender[i].split('/')[filesToRender[i].split('/').length-1].split('.')[0]+ '.html';

    let filePath = `./_site/${fileName}`
    let output = Mustache.render(template,{...view, sections})

    pagesArray.push({
      output, filePath,"stylesheet" : page.options.style,
    })
  }
  return pagesArray
}

module.exports = assemblePages
