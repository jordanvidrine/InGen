const Mustache = require('mustache')
const fs = require('fs-extra')

const { getSectionContent, getPageContent, getPosts } = require('./content')

let assemblePages = async function(filesToRender) {

  let sections = await getSectionContent();
  let posts = await getPosts();

  let pagesArray = [];

  // Renders output of each page in the pages array, also stores the
  // filename to be used, and the stylesheet used
  for (let file of filesToRender) {
    let view;
    let page = await getPageContent(file)
    // if page had blog option set to true, add correct number of posts to the view
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
    
    let template = await fs.readFileSync(page.options.template, 'utf8');

    let fileName = file.split('/')[file.split('/').length-1].split('.')[0]+ '.html';

    let filePath = `./_site/${fileName}`
    let output = Mustache.render(template,{...view, sections})

    pagesArray.push({
      output, filePath,"stylesheet" : page.options.style,
    })
  }
  return pagesArray
}

async function savePosts() {

}

module.exports = {assemblePages, savePosts}
