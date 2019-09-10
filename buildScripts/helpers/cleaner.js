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

module.exports = {cleanOut}
