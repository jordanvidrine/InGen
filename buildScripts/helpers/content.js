const MarkdownIt = require('markdown-it')()
const fsPromises = require('fs').promises


// This script will look at all of the MD files in /content/sections
// and return an object containing section titles as keys, and their corresponding
// rendered markdown to html text
async function getSectionContent () {
  let sectionContent = {};
  try {
    let sections = await fsPromises.readdir('./content/sections');

    // renders markdown into html files and stores them to sectionContent object
    for (let i = 0; i < sections.length; i++) {

      // only render files ending in .md
      if (/(.md)$/.test(sections[i])) {
        let rawContent = await fsPromises.readFile(`./content/sections/${sections[i]}`, 'utf8')
        let renderedContent = MarkdownIt.render(rawContent)
        let html = '<section>' + renderedContent + '</section>'
        sectionContent[`${sections[i].split('.')[0]}`] = html;
      }
    }

    return sectionContent;
  }
  catch (e) {
    return e;
  }
}

async function getPosts() {
  let postsContent = [];
  try {
    let posts = await fsPromises.readdir('./content/posts');

    // renders markdown into html and stores it to the postsContent object
    // will also need to save to individual html files for pages that show singular
    // posts
    for (let i = 0; i < posts.length; i++) {
      let postContent = await fsPromises.readFile(`./content/posts/${posts[i]}`, 'utf8')

      // parse options and store to an object
      let dataArray = postContent.split('\n').map(line => line.replace('\r',''))
      let postData = {}
      dataArray.splice(dataArray.indexOf('---')+1,dataArray.lastIndexOf('---')-1).forEach(data => {
        let key = data.split(':')[0]
        postData[key] = data.split(':')[1].trim()
      })
      // removing front matter from content
      postContent = postContent.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/, "");
      // render to html
      postContent = MarkdownIt.render(postContent)

      let year = postData.date.split('-')[postData.date.split('-').length-1]
      let month = postData.date.split('-')[0]

      let fileName = `/posts/${year}/${month}/${postData.date}-${postData.title.replace(" ", "-")}.html`

      postData = {...postData, fileName}

      // replace posts that contain readmore with the link to the main post
      shortenedContent = postContent.replace(/(&lt;!--read more--&gt;)([\w\d\s\W\D\S])*/g,`<a href="${fileName}">Read more!</a>`)

      postsContent.push({
        content: shortenedContent,
        fullContent: postContent.replace(/(\n?\r?)(<p>)(&lt;!--read more--&gt;\n?\r?)(<\/p>)(\n?\r?)*/g,''),
        data: postData
      })
    }
  } catch (e) {
    console.log(e)
  }
  return postsContent
}

getPosts()

async function getPageContent(path) {

  let content = await fsPromises.readFile(path, 'utf8');
  // create array from page content to be able to parse options (strips whitespace)
  contentArray = content.split('\n').map(line => line.replace('\r',''))

  let options = {}

  // Parses options from md front matter & assigns key/value pairs to options object
  contentArray.splice(contentArray.indexOf('---')+1,contentArray.lastIndexOf('---')-1).forEach(option => {
    let key = option.split(':')[0]
    // checks to see if options is a stylesheet or template
    // will add '.css' or '.html'
    if (key === 'template') {
      let value = option.split(':')[1].replace(/\n/,'').trim()
      options[option.split(':')[0]] = './templates/' + value + '.html'
    } else {
      // otherwise define the options literally
      options[option.split(':')[0]] = option.split(':')[1].replace(/\n/,'').trim()
    }
  })

  // removing front matter from content
  content = content.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/g, "");
  // rendering MD to html
  content = MarkdownIt.render(content)

  return {
    options, content
  }
}

getPosts()

module.exports = {
  getSectionContent,
  getPageContent,
  getPosts
}
