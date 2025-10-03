// Importamos el módulo 'fs' (File System) de Node.js para poder leer archivos.
const fs = require('fs');

// Verificamos si estamos en un entorno de producción. Esto es útil para el pathPrefix.
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(eleventyConfig) {
  
  // --- PASSTHROUGH COPY ---
  // Copia los archivos y directorios estáticos a la carpeta de salida (_site).
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("favicon.svg");

  // --- FILTROS ---
  // Filtro para obtener el nombre de la categoría en el idioma correcto.
  // Tu implementación original es correcta, solo la he formateado un poco.
  eleventyConfig.addFilter("getCategoryName", function(tag, lang = 'es') {
    // 'this.ctx' da acceso a los datos globales, como 'categoryNames.js'.
    const categoryNames = this.ctx.categoryNames; 
    if (categoryNames && categoryNames[tag] && categoryNames[tag][lang]) {
        return categoryNames[tag][lang];
    }
    return tag; // Devuelve el tag original si no hay traducción.
  });

  // --- COLECCIONES ---
  // Crea una colección de 'tags' única y ordenada.
  // Tu implementación original es buena, la mantendremos.
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
    // Filtramos tags internos de Eleventy para no mostrarlos en la lista de categorías.
    return [...tagSet].filter(tag => !['all', 'nav', 'post', 'posts'].includes(tag)).sort();
  });

  // --- SHORTCODES (NUEVO) ---
  // Añadimos los shortcodes para el contenido reutilizable.
  
  // Shortcode para el CTA de Instagram
  // Uso en plantillas: {% instagramCta %}
  eleventyConfig.addShortcode("instagramCta", function() {
    try {
      // Leemos el contenido del archivo parcial y lo devolvemos.
      return fs.readFileSync("_includes/partials/instagram-cta.njk", "utf8");
    } catch (error) {
      console.error("Error al leer el parcial _includes/partials/instagram-cta.njk:", error);
      return ""; // Devolvemos una cadena vacía en caso de error para no romper el build.
    }
  });

  // Shortcode para el Disclaimer del post
  // Uso en plantillas: {% postDisclaimer %}
  eleventyConfig.addShortcode("postDisclaimer", function() {
    try {
      return fs.readFileSync("_includes/partials/disclaimer.njk", "utf8");
    } catch (error) {
      console.error("Error al leer el parcial _includes/partials/disclaimer.njk:", error);
      return "";
    }
  });

  // --- CONFIGURACIÓN DE RETORNO ---
  // Esta es la configuración principal de Eleventy.
  return {
    // El pathPrefix es crucial para que las URLs funcionen en GitHub Pages.
    pathPrefix: isProduction ? "/psicologia/" : "/",
    
    // Definición de directorios.
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data", // Añadido para ser explícito, aunque es el valor por defecto.
      output: "_site"
    },
    
    // Formatos de plantilla que Eleventy procesará.
    templateFormats: ["njk", "md", "html"],
    
    // Especificamos que los archivos Markdown y HTML deben ser procesados por Nunjucks.
    // Esto permite usar variables y lógica de Nunjucks (como los shortcodes) dentro de ellos.
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};