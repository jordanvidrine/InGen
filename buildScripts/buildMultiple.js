const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const MarkdownIt = require('markdown-it')();
const { cleanOut, createSiteDir } = require('./cleanout')

// resets the character escaping to not escape any chars
// had issues with handlebars escaping < and > tags in html for some reason
Mustache.escape = function(text) {return text;};

// This script will look at all of the MD files in content
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

async function hbsParser(path) {
  let options = {};
  let sectionContent = await getSectionContent()
  options['sections'] = sectionContent;

  let content = await fsPromises.readFile(path, 'utf8');
  let optionsArray = content.toString().split('\n')

  // parsing options set in front matter
  optionsArray.splice(optionsArray.indexOf('---\r')+1,optionsArray.lastIndexOf('---\r')-1).forEach(option => {
    let key = option.split(':')[0]
    // checks to see if options is a stylesheet or template
    // will add '.css' or '.html'
    if (key === 'template') {
      let value = option.split(':')[1].replace(/\r/,'').trim()
      options[option.split(':')[0]] = './templates/' + value + '.html'
    } else {
      // otherwise define the options literally
      options[option.split(':')[0]] = option.split(':')[1].replace(/\r/,'').trim()
    }
  })

  // removing front matter from content
  content = content.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/g, "");

  // rendering MD to html
  content = MarkdownIt.render(content);

  // sets the css file link to be relative to the folder the created html file will reside in
  // will duplicate the css file into this folder from node

  // setting view to be the content and any options present from the md file
  // this contains the data that will be injected into the handlebars template used to
  // generate the html
  let view = {
    title: options.title,
    content,
    // save the style to the actual location in the built site directory
    // will be inserted into the generated html as a stylesheet link
    style: `./assets/css/${options.style}.css`,
    sections: options.sections
  }

  // get the template
  let template = await fsPromises.readFile(options.template, 'utf8')

  // render the page using the template and the view
  let output = Mustache.render(template, view)

  // clear _site and recreate it
  if (fs.existsSync('./_test-site')) {
    cleanOut('./_test-site')
  }

  await createSiteDir('./_test-site')

  // save the rendered output to an html file
  await fsPromises.writeFile(`_test-site/${path.split('/')[path.split('/').length-1].split('.')[0]}.html`,output, 'utf8')

  // copy the css stylesheet chosen into the css folder
  await fsPromises.copyFile(`./templates/css/${options.style}.css`, `_test-site/assets/css/${options.style}.css`)
}

 hbsParser('./content/index.md')
