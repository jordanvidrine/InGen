const fs = require('fs')
const fsPromises = fs.promises
const MarkdownIt = require('markdown-it')();
const getSectionContent = require('./getSectionContent')

async function getData(path) {
  let sections = await getSectionContent()

  let pageContent = await fsPromises.readFile(path, 'utf8');
  // create array from page content to be able to parse options
  pageContentArray = pageContent.split('\n').map(line => line.replace('\r',''))
  let options = {}

  // Parses options from md front matter & assigns key/value pairs to options object
  pageContentArray.splice(pageContentArray.indexOf('---')+1,pageContentArray.lastIndexOf('---')-1).forEach(option => {
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
  pageContent = pageContent.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/g, "");
  // rendering MD to html
  pageContent = MarkdownIt.render(pageContent)

  return {
    options,
    sections,
    pageContent,
  }

}

module.exports = getData
