const fs = require("fs-extra");

module.exports = skeleton = async function () {
  // get contents of the asset folder in content directory
  let contentAssets = fs.readdirSync(`./content/assets/`);

  contentAssets.forEach(async (folder) => {
    let _sitePath = `./_site/assets`;
    let contentPath = `./content/assets`;

    // create a directory in _site/assets to match each one in content/assets
    await fs.ensureDir(`${_sitePath}/${folder}`, { recursive: true });

    // get the contents of the folder currently parsed by forEach
    let folderContents = fs.readdirSync(`${contentPath}/${folder}`);

    // for each file in the folder, copy it to the corresponding _site/assets
    for (let file of folderContents) {
      let copy = `${_sitePath}/${folder}/${file}`;
      let original = `${contentPath}/${folder}/${file}`;
      await fs.copy(original, copy);
      console.log(`Copied ${original} to ${copy}`);
    }
  });
};
