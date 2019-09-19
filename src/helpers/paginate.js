const fs = require('fs-extra')

function paginate(posts, options) {

  let maxPosts = parseInt(options.hash.num) || 3
  let count = 1;
  let totalPosts = 1;
  let page = 1;
  let mainHtml = '';
  let blogIndexCreated = false;
  // will be an array of rendered Html to use to save individual pages
  let pageHtml = [];

  for (let post of posts) {

    // builds first 'blog page'
    if (!blogIndexCreated) {
      if (count < maxPosts) {
        mainHtml = mainHtml + options.fn(post)
        count++
        totalPosts++
        // once count reaches maxPosts, add the pagination link and set
        // blogIndexCreated to true
      } else if (count === maxPosts) {
        mainHtml = mainHtml + options.fn(post) + `<span id="next-page"><a href="./page/${page+1}.html"/>Next Page</a></span>`;
        blogIndexCreated = true;
        count = 1;
        totalPosts++
        page++
        // if posts count equals the amount of posts before reaching
        // maxposts amount, the page is finished being created and does
        // not need a pagination link
      } else if (totalPosts === posts.length) {
        mainHtml = mainHtml + options.fn(post);
      }

      // builds remaining blog pages from posts left after building index
    } else {
      if (count < maxPosts && totalPosts < posts.length) {
        // accounts for the first pass of adding html to the page
        pageHtml[page-2] == undefined ?
        pageHtml[page-2] = options.fn(post) :
        // if this is not the first pass, continue to add posts to pageHtml
        pageHtml[page-2] = pageHtml[page-2] + options.fn(post)

        count++
        totalPosts++

      // when last post of the page but more pages are going to be built
      } else if (count === maxPosts && totalPosts < posts.length) {
        let prevPage = '';

        // if this is the second page of the blog, use 'index' as the previous
        // page, as there is no '1.html'
        if (page-1 === 1) {
          prevPage = `<span id="prev-page"><a href="../index.html"/>Prev Page</a></span>`
        } else {
          prevPage = `<span id="prev-page"><a href="./${page-1}.html"/>Prev Page</a></span>`
        }

        // this if statement is for a setting of maxposts to 1
        // if thats the case, this would be the first pass
        if (!pageHtml[page-2]) pageHtml[page-2] = ''
          pageHtml[page-2] = pageHtml[page-2] + options.fn(post) + prevPage + `<span id="next-page"><a href="./${page+1}.html"/>Next Page</a></span>`;

          // html boilerplate for creating new pages
          let newPage = `<!DOCTYPE html>
          <html lang="en" dir="ltr">
            <head>
              <meta charset="utf-8">
              <title>Blog Page - ${page}</title>
              <link rel="stylesheet" href='/assets/css/splendor.css'>
            </head>
            <div id = "nav">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
            </div>
            <body>` + pageHtml[page-2] + `</body></html>`

            fs.outputFileSync(`./_site/blog/page/${page}.html`, newPage)

            page++;
            totalPosts++;
            count = 1;

      // if this is the LAST post of the blog, regardless of counters, etc
      } else if (totalPosts === posts.length) {
        if (!pageHtml[page-2]) pageHtml[page-2] = ''

        let prevPage;
        if (page-1 === 1) {
          prevPage = '/blog/index.html'
        } else {
          prevPage = `./${page-1}.html`
        }

        pageHtml[page-2] = pageHtml[page-2] + options.fn(post) + `<span id="next-page"><a href="${prevPage}"/>Prev</a></span>`;

        let newPage = `<!DOCTYPE html>
        <html lang="en" dir="ltr">
          <head>
            <meta charset="utf-8">
            <title>Blog Page - ${page}</title>
            <link rel="stylesheet" href='/assets/css/splendor.css'>
          </head>
          <div id = "nav">
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
          </div>
          <body>` + pageHtml[page-2] + `</body></html>`

          fs.outputFileSync(`./_site/blog/page/${page}.html`, newPage)

          page++
          totalPosts++
          count = 1;
      }
    }
  }
  return mainHtml;
}

module.exports = paginate
