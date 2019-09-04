const fs = require('fs')
const fsPromises = fs.promises
const MarkdownIt = require('markdown-it')();

async function getPageContent(path) {

  let content = await fsPromises.readFile(path, 'utf8');
  // create array from page content to be able to parse options
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

module.exports = getPageContent
