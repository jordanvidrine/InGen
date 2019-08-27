const Mustache = require('mustache')
const fs = require('fs')
const fsPromises = fs.promises
const MarkdownIt = require('markdown-it')();

Mustache.escape = function(text) {return text;};

async function hbsParser(path) {
  let content = await fsPromises.readFile(path, 'utf8');
  let optionsArray = content.toString().split('\n')
  let options = {};

  // parsing options set in front matter
  optionsArray.splice(optionsArray.indexOf('---\r')+1,optionsArray.lastIndexOf('---\r')-1).forEach(option => {
    // sets options from what was entered into the Front Matter of the markdown file
    options[option.split(':')[0]] = option.split(':')[1].replace(/\r/,'').trim()
  })

  // removing front matter from content
  content = content.replace(/(---\r?\n)(.*\r?\n)*(---\r?\n)/g, "");

  // rendering MD to html
  content = MarkdownIt.render(content);

  // setting view to be the content and any options present from the md file
  let view = {
    title: options.title,
    content
  }

  // get the template
  let template = await fsPromises.readFile('./_site/handleBars.html', 'utf8')
  // render the page using the template and the view
  let output = Mustache.render(template, view)

  // save the rendered output to an html file
  await fsPromises.writeFile(`_test-site/${view.title}.html`,output, 'utf8')

}

hbsParser('./content/handleBars.md')
