const Mustache = require("mustache");
const fs = require("fs-extra");

const {
  getSectionContent,
  getPageContent,
  getPosts,
  getPartials,
} = require("./content");
Mustache.escape = function (text) {
  return text;
};

async function assemblePages(filesToRender) {
  let sections = await getSectionContent();
  let posts = await getPosts();
  let partials = await getPartials();

  let pagesArray = [];

  // Renders output of each page in the pages array, also stores the
  // filename to be used, and the stylesheet used
  for (let file of filesToRender) {
    let view;
    let page = await getPageContent(file);

    // if page had blog option set to true, add correct number of posts to the view
    if (page.options.blog) {
      let maxPosts = page.options.maxPosts;
      view = {
        title: page.options.title,
        content: page.content,
        style: `../assets/css/${page.options.style}.css`,
        // if maxPosts doesnt exist, render all blog posts
        posts: maxPosts ? Array.from(posts).splice(0, maxPosts) : posts,
      };
    } else {
      view = {
        title: page.options.title,
        content: page.content,
        style: `./assets/css/${page.options.style}.css`,
      };
    }

    let template = await fs.readFileSync(page.options.template, "utf8");

    let fileName =
      file.split("/")[file.split("/").length - 1].split(".")[0] + ".html";

    let filePath = `./_site/${fileName}`;

    // passing in views, sections, and partials to be allowed use on blog.html or index.html
    let output = Mustache.render(template, { ...view, sections }, partials);

    pagesArray.push({
      output,
      filePath,
      stylesheet: `./assets/css/${page.options.style}.css`,
    });
  }
  return pagesArray;
}

async function savePosts() {
  let posts = await getPosts();
  let template = await fs.readFileSync("./templates/post.html", "utf8");
  let partials = await getPartials();

  for (post of posts) {
    let output = Mustache.render(
      template,
      { content: post.fullContent, data: post.data },
      partials
    );
    await fs.outputFile(post.data.fileName, output, { flag: "w+" });
    console.log(`Blog post saved to ${post.data.fileName}`);
  }
}

module.exports = { assemblePages, savePosts };
