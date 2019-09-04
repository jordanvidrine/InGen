const fs = require('fs')
const fsPromises = fs.promises

// inspired by https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/

let cleanOut = function(path) {
    let dir = fs.readdirSync(path)

    for (let i = 0; i < dir.length ; i++) {
      let currentPath = `${path}/${dir[i]}`;
      let stats = fs.lstatSync(currentPath);
      let isDirectory = stats.isDirectory()

      if (isDirectory) {
        cleanOut(currentPath)
      } else {
        fs.unlinkSync(currentPath)
        // console.log(`Deleted: ${currentPath}`)
      }
    }
    fs.rmdirSync(path)
    // console.log(`Deleted: ${path}`)

}

let createSiteDir = async function(path) {
  let css = `${path}/assets/css`.replace(/\/+$/,"")
  let img = `${path}/assets/img`.replace(/\/+$/,"")
  let js = `${path}/assets/js`.replace(/\/+$/,"")

  try {
    await fsPromises.mkdir(css, {recursive:true})
    await fsPromises.mkdir(img, {recursive:true})
    await fsPromises.mkdir(js, {recursive:true})
  } catch (e) {
    console.log(e)
  }
}

module.exports = { cleanOut, createSiteDir }
