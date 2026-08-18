module.exports = function (eleventyConfig) {
  // Only .njk and .md are processed as templates; every existing static
  // file is copied through untouched so the book site is unchanged.
  [
    "index.html", "works.html", "thanks.html",
    "favicon.svg", "author.jpg", "og-image.png", "routledge-logo.png",
    "chronology.csv", "robots.txt", "sitemap.xml", "CNAME",
    "fonts", "assets"
  ].forEach((f) => eleventyConfig.addPassthroughCopy(f));

  // Writing collection: newest first
  eleventyConfig.addCollection("writing", (c) =>
    c.getFilteredByGlob("writing/*.md").sort((a, b) => b.date - a.date)
  );

  // Date helpers
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  return {
    dir: { input: ".", output: "_site", includes: "_includes" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
