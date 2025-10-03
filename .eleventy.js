const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(eleventyConfig) {
  
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addFilter("getCategoryName", function(tag, lang = 'es') {
    const categoryNames = this.ctx.categoryNames; 
    if (categoryNames && categoryNames[tag] && categoryNames[tag][lang]) {
        return categoryNames[tag][lang];
    }
    return tag; 
});

  eleventyConfig.addCollection("tagList", collection => {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });
    return [...tagSet].filter(tag => !['all', 'nav', 'post', 'posts'].includes(tag));
  });

  return {
    pathPrefix: isProduction ? "/psicologia/" : "/",
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};