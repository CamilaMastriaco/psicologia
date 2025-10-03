module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("favicon.svg");
  
    return {
      dir: {
        input: ".",
        includes: "_includes",
        output: "_site"
      }
    };
  };