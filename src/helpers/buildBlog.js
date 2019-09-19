const paginate = require('./paginate')
const fs = require('fs-extra')
const {getPosts, getPageContent, getPartials} = require('./content')
const Handlebars = require('handlebars')

Handlebars.registerHelper("paginate", paginate)

async function buildBlog() {
  let blog = await getPageContent('./content/blog.md')
  let posts = await getPosts()
  let partials = await getPartials();

  let view = {
    title: blog.options.title,
    content: blog.content,
    style: `./assets/css/${blog.options.style}.css`,
    posts
  }

  let template = await fs.readFileSync(blog.options.template, 'utf8');
  template = Handlebars.compile(template)

  for (let partial in partials) {
    Handlebars.registerPartial(partial, partials[partial])
  }

  let output = template(view)

  await fs.outputFile('./_site/blog/index.html', output, {flag: 'w+'})
}

buildBlog();

module.exports = buildBlog
