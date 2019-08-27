const fs = require('fs').promises
const parser = require('./parser')
const MarkdownIt = require('markdown-it')();

async function renderFiles(dir) {
  try {
    let files = await fs.readdir(dir)
    
    for (let i = 0; i < files.length ; i++) {
      let readFile = await parser(`${dir}/${files[i]}`, 'utf8')
      let renderedFile = MarkdownIt.render(readFile.markDown)
      let fileName = files[i].split('.')[0]

      // build html, inserting titles, and other options as needed, as well as
      // what was rendered from MarkdownIt
      let html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>${readFile.options.title || `Default Title`}</title>
</head>
<body>
  `+ renderedFile + `
</body>
</html>`
      await fs.writeFile(`_site/${fileName}.html`,html, 'utf8')
    }

  } catch (e) {
    console.log(e)
  }
}

renderFiles('./content')
