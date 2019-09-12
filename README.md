# InGen
A very basic and minimal static site generator built with NodeJS. The templating engine used is [Mustache](https://www.npmjs.com/package/mustache), as well as [Markdown-it](https://www.npmjs.com/package/markdown-it) for markdown to html conversion.

For development, the built site uses [Express](https://www.npmjs.com/package/express) to serve the site to the user at `localhost:3000` for design/testing purposes. The files are watched for changes and the site is rebuilt and server is restarted using [Nodemon](https://www.npmjs.com/package/nodemon).

_ATTN: This project is a work in progress as an exercise for myself to get more familiar with NodeJs and working with the file system._

## How to use
To use InGen, first install [NodeJs](https://nodejs.org/en/) on your own machine.

Next, download and unzip the current release here: [Ingen v1.0](https://github.com/jordanvidrine/InGen/releases/tag/v1.0)

Once you have unzipped the folder, navigate to the folder using the NodeJs command prompt. Once in the folder run `npm install`. This will install the dependencies needed for InGen to function properly.

Next create an `.md` file in the `content` directory. For the site to work properly it needs one `index.md`. Other `.md` files can be created as well.

In that markdown file use the following structure for the 'head' of the document, also called front matter. Below the front matter, feel free to create any markdown specific content you wish. Front Matter MUST exist for build to work properly.
```markdown
---
title: My First Ingen Page
style: splendor
template: base
---

# My First InGen Page
Welcome to my first page created with Jordan Vidrine's InGen static site generator!
```
The title can be anything you wish as long it is a single line of text as above.

The style and template MUST correspond to an actual named style sheet from the `content/assets/css` folder and an actual named `.html` file in the `templates` directory. In this case `content/assets/css/splendor.css` and `templates/base.html`

This setup will allow the markdown content from your `index.md` file to be converted into HTML and rendered using a templating engine called Mustache. Please read the [Mustache docs](https://mustache.github.io/) to familiarize yourself with the correct syntax.

The `base.html` file comes loaded into the downloaded folder. Inside is this:
```HTML
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <link rel="stylesheet" href='{{style}}'>
  </head>
  <body>
    {{content}}
  </body>
</html>
```

What this will render is the `Title` specified in `index.md` as well as all of the content under the front matter.

Now that this is complete, open up the NodeJs command prompt, navigate to the InGen directory, and run `npm run build`. If the script properly ran, your terminal should look like this: You will now also have a `_site` directory in your InGen folder.

![npm run build](/readme-assets/runbuild.PNG)

If everything worked properly, navigate to `localhost:3000` and you should see this:

![first build](/readme-assets/firstBuild.PNG)

_**More Documentation to come soon**_

I will explain how to use `.md` files created in `content/posts` in tandem with Mustache templating to render a blog page.

#### TODOS
- **Implement pagination on blog/index.html**
- (DONE!) Implement build to save MD post files to their respective location inside of site
  - example: /site/posts/8/8-1-19-Blog-Post-Title.html
- (DONE!) Implement dev server to dynamically watch file edits
- (DONE!) Copy assets folder from content to site
- (DONE!) Implement ability to add posts from a post directory to the site
- (DONE!) Separate getting page data from getting sections as they are independent of one another
- (DONE!) Creation of multiple .html files at once
