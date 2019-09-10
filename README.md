# InGen
A friend suggested to get deeper with my learning that I should attempt to build my own static site generator.

I started reading Jurassic Park last night, and today I will start building this generator.

Here is my attempt.

### TODOS
- Implement dev server to dynamically watch file edits
- Implement build to save MD post files to their respective location inside of site
  - example: /site/posts/8/8-1-19-Blog-Post-Title.html
- Refactor code using Node's Url Parser, and path resolve, and sep
- (DONE!) Copy assets folder from content to site
- (DONE!) Implement ability to add posts from a post directory to the site
- (DONE!) Separate getting page data from getting sections as they are independent of one another
- (DONE!) Creation of multiple .html files at once
