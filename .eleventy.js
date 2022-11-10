const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const util = require('util');

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/favicon*");

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
  });

  eleventyConfig.addCollection("tagsList", function(collectionApi) {
    const tagsList = new Set();
    const tagCount = {}
    collectionApi.getAll().map( item => {
        if (item.data.tags) { // handle pages that don't have tags
          item.data.tags.map( tag => {
            tagsList.add(tag)
            tagCount[tag] = (tagCount[tag] || 0) + 1 
          })  
        }
    });

    const c = [];
    tagsList.forEach( tag => {
      c.push({name: tag, count: tagCount[tag]})
    });

    c.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return c;
  });

  return {
    dir: {
      input: "src",
    }
  }
};
