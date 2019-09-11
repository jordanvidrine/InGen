const fs = require("fs")
const fsPromises = require("fs").promises

module.exports.buildSkeleton = async function() {
  // get contents of the asset folder in content directory
  let contentAssets = fs.readdirSync(`./content/assets/`);

  contentAssets.forEach(async folder => {
    let _sitePath = `./_site/assets`;
    let contentPath = `./content/assets`

    // create a directory in _site/assets to match each one in content/assets
    await fsPromises.mkdir(`${_sitePath}/${folder}`, {recursive: true})

    // get the contents of the folder currently parsed by forEach
    let folderContents = fs.readdirSync(`${contentPath}/${folder}`)

    // for each file in the folder, copy it to the corresponding _site/assets
    folderContents.forEach(async file => {
      let copy = `${_sitePath}/${folder}/${file}`
      let original = `${contentPath}/${folder}/${file}`
      await fsPromises.copyFile(original, copy)
    })
  })
}
