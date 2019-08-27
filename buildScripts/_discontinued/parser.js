const fs = require('fs');
const fsPromises = fs.promises
const MarkdownIt = require('markdown-it')();

async function parser(fileLocation) {
  try {
    let fileData = await fsPromises.readFile(fileLocation, 'utf8');
    let parsingArray = fileData.toString().split('\n')
    let options = {};

    // parse over the front matter
    parsingArray.splice(parsingArray.indexOf('---\r')+1,parsingArray.lastIndexOf('---\r')-1).forEach(option => {
      // sets options from what was entered into the Front Matter of the markdown file
      options[option.split(':')[0]] = option.split(':')[1].replace(/\r/,'').trim()
    })

    return {
      markDown: fileData.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/g, ""),
      options
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = parser
