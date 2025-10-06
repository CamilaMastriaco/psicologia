const fs = require('fs');
const Image = require("@11ty/eleventy-img");

const isProduction = process.env.NODE_ENV === 'production';

async function imageShortcode(src, alt, classes, sizes = "100vw") {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [300, 600, 900, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img/",
    urlPath: isProduction ? "/psicologia/img/" : "/img/",
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        class="${classes}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function(eleventyConfig) {
  
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

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