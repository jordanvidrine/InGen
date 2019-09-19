const Mustache = require('mustache')
const Handlebars = require('handlebars')
const fs = require('fs-extra')

const { getSectionContent, getPageContent, getPosts, getPartials } = require('./content')

async function savePosts() {

  let posts = await getPosts();
  let template = await fs.readFileSync('./templates/post.html', 'utf8')
  template = Handlebars.compile(template)
  let partials = await getPartials();

  for (let partial in partials) {
    Handlebars.registerPartial(partial, partials[partial])
  }

  for (post of posts) {
    let output = template({content: post.fullContent, data: post.data})
    await fs.outputFile(post.data.fileName, output, {flag:'w+'})
  }

}

module.exports = savePosts
