const Mustache = require("mustache");
const fs = require("fs-extra");
const path = require("path");
const MarkdownIt = require("markdown-it")();
const skeleton = require("./helpers/skeleton");
const { assemblePages, savePosts } = require("./helpers/assembly");
const { log } = require("console");

// resets the character escaping to not escape any chars
// had issues with handlebars escaping '<' and '>' tags in html for some reason
Mustache.escape = function (text) {
  return text;
};

async function build(dirPath) {
  try {
    let dirContent = fs.readdirSync(dirPath);
    let filesToRender = [];

    // loop over content to add .md files to filesToRender array
    for (let file of dirContent) {
      let isMarkDown = /(.md)$/.test(file);
      if (isMarkDown) {
        filesToRender.push(`${dirPath}/${file}`);
      }
    }
    let pages = await assemblePages(filesToRender);

    await fs.emptyDir("./_site");
    console.log("Cleaning up _site directory...");

    await skeleton();

    // loop over pages and save the output of each to an html file
    for (let page of pages) {
      // save blog page to blog/index.html
      if (page.filePath === "./_site/blog.html")
        page.filePath = "./_site/blog/index.html";
      await fs.outputFile(page.filePath, page.output, { flag: "w+" });
      log(`Saved ${page.filePath}`);
    }

    // save posts to the _site/blog folder in corresponding locations
    await savePosts();
  } catch (e) {
    console.log(e);
  }
}

// will build site from content in the /content directory
// all files to be rendered must be in the root of /content and be an .MD file
build("./content");
