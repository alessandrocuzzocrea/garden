const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const util = require('util');

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
});

  return {
    dir: {
      input: "src",
    }
  }
};
