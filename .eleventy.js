const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const util = require('util');

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/favicon*");
  eleventyConfig.addPassthroughCopy("src/notes/images");

  eleventyConfig.addFilter('console', function (value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
  });

  eleventyConfig.addCollection("tagsList", function (collectionApi) {
    const tagsList = new Set();
    const tagCount = {}
    collectionApi.getAll().map(item => {
      if (item.data.tags) {
        item.data.tags.map(tag => {
          tagsList.add(tag)
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    });

    const c = [];
    tagsList.forEach(tag => {
      c.push({ name: tag, count: tagCount[tag] })
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

  eleventyConfig.addNunjucksFilter("tagsSortByCount", function (tags) {
    tags.sort((a, b) => a.count - b.count);
    return tags
  });

  eleventyConfig.addNunjucksFilter("take", function (tags, arg) {
    return tags.slice(0, arg);
  });

  // eleventyConfig.addFilter("excerpt", (post) => {
  //   const content = post.replace(/(<([^>]+)>)/gi, "");
  //   return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  // });

  return {
    dir: {
      input: "src",
    }
  }
};
