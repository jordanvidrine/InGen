const Handlebars = require('handlebars')
const fs = require('fs-extra')

const { getSectionContent, getPageContent, getPosts, getPartials } = require('./content')

async function assemblePages(filesToRender) {

  let sections = await getSectionContent();
  let posts = await getPosts();
  let partials = await getPartials();

  let pagesArray = [];

  // Renders output of each page in the pages array, also stores the
  // filename to be used, and the stylesheet used
  for (let file of filesToRender) {
    let view;
    let page = await getPageContent(file)

    // if page had blog option set to true, add correct number of posts to the view
    if (page.options.blog) {
      let maxPosts = page.options.maxPosts
      view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`,
        // if maxPosts doesnt exist, render all blog posts
        posts:  maxPosts ? Array.from(posts).splice(0,maxPosts) : posts
      }
    } else {
      view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`
      }
    }

    let template = await fs.readFileSync(page.options.template, 'utf8');
    template = Handlebars.compile(template)

    let fileName = file.split('/')[file.split('/').length-1].split('.')[0] + '.html';
    let filePath = `./_site/${fileName}`

    for (let partial in partials) {
      Handlebars.registerPartial(partial, partials[partial])
    }

    let output = template({...view, sections})

    pagesArray.push({
      output, filePath, "stylesheet" : page.options.style,
    })
  }
  return pagesArray
}

module.exports = assemblePages
