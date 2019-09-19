const fs = require('fs-extra')

function paginate(posts, options) {

  let maxPosts = parseInt(options.hash.num) || 2
  let count = 1;
  let totalPosts = 1;
  let page = 1;
  let mainHtml = '';
  let firstPageBuilt = false;
  let pageHtml = [];

  for (let post of posts) {

    // builds first 'blog page'
    if (!firstPageBuilt) {

      if (count < maxPosts) {
        mainHtml = mainHtml + options.fn(post)
        count++
        totalPosts++

      } else if (count === maxPosts) {
          mainHtml = mainHtml + options.fn(post) + `<span id="next-page"><a href="./page/${page+1}.html"/>Next Page</a></span>`;
          firstPageBuilt = true;
          count = 1;
          totalPosts++
          page++
      }

    } else {
      // once first blog page is built, will use remaining posts to create and save pages, dependent on amount set per page.
      if (count < maxPosts && totalPosts < posts.length) {
        pageHtml[page-2] == undefined ? pageHtml[page-2] = options.fn(post) : pageHtml[page-2] = pageHtml[page-2] + options.fn(post)
        count++
        totalPosts++

      // if the is the last post of the page, but more pages are going to be built
      } else if (count === maxPosts) {
        // this takes care of injecting 'undefined' into the html
        // this only happens if maxPosts was set to 1
        let prevPage = '';

        // inserts appropriate 'previous page' link depending on page/post count
        if (page-1 === 1) {
          prevPage = `<span id="prev-page"><a href="../index.html"/>Prev Page</a></span>`
        } else {
          prevPage = `<span id="prev-page"><a href="./${page-1}.html"/>Prev Page</a></span>`
        }
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
