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

module.exports = getSectionContent
