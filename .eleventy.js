const fs = require('fs');

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
    return [...tagSet].filter(tag => !['all', 'nav', 'post', 'posts'].includes(tag)).sort();
  });

  eleventyConfig.addShortcode("instagramCta", function() {
    try {
      return fs.readFileSync("_includes/partials/instagram-cta.njk", "utf8");
    } catch (error) {
      console.error("Error al leer el parcial _includes/partials/instagram-cta.njk:", error);
      return ""; 
    }
  });

  eleventyConfig.addShortcode("postDisclaimer", function() {
    try {
      return fs.readFileSync("_includes/partials/disclaimer.njk", "utf8");
    } catch (error) {
      console.error("Error al leer el parcial _includes/partials/disclaimer.njk:", error);
      return "";
    }
  });

  return {
    pathPrefix: isProduction ? "/psicologia/" : "/",
    
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data", 
      output: "_site"
    },
    
    templateFormats: ["njk", "md", "html"],
    
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};