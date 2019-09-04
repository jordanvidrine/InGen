const MarkdownIt = require('markdown-it')();
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

module.exports = {
  getSectionContent,
  getPageContent
}
