# InGen
A friend suggested to get deeper with my learning that I should attempt to build my own static site generator.

I started reading Jurrasic Park last night, and today I will start building this generator.

Here is my attempt.

### 8-27-19
Worked throughout the day on using Node's fs system. I eventually opted for using their experimental promisified version for what I am doing.

I learned how to read files, read directories, and write files to directories.

My current implementation (for now) will use the [MarkdownIt NPM module](https://www.npmjs.com/package/markdown-it) to render html from markdown files.

For the templating engine, I am using the [handlebars package](https://www.npmjs.com/package/mustache)

#### Rendering
First, using the fs module, I read a markdown file from the content directory. I then parse that markdown for any front matter stored. This will be used to set the page title, and eventually, use the right template to render to html.

Next up, I store the front matter and the rest of the content in an object to be passed to the handlebars renderer.

The output from that is saved to a directory to be served as the website.
