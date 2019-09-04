const fs = require('fs')
const fsPromises = fs.promises
const getSectionContent = require('./getSectionContent')
const getPageContent = require('./getPageContent')

async function getData(path) {
  let sections = await getSectionContent()

  let pageData = await getPageContent(path)

  return {
    "options" : pageData.options,
    sections,
    "pageContent": pageData.content ,
  }

}

module.exports = getData
