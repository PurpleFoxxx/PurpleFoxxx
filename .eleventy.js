module.exports = function (eleventyConfig) {
  // ---- Passthrough copy (files that don't need templating) ----
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({
    "src/assets/css/tailwind.css": "assets/css/tailwind.css",
  });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({
    "src/site.webmanifest": "site.webmanifest",
  });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });

  // ---- Watch targets (so eleventy --serve reloads on Tailwind rebuild) ----
  eleventyConfig.addWatchTarget("src/assets/css/tailwind.css");

  // ---- Filters ----
  eleventyConfig.addFilter("dateReadable", (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  });

  eleventyConfig.addFilter("rankTier", (rank) => {
    if (/^1st/i.test(rank)) return "gold";
    if (/^2nd/i.test(rank)) return "silver";
    if (/^3rd/i.test(rank)) return "bronze";
    return "outline";
  });

  eleventyConfig.addFilter("rankParts", (rank) => {
    const top = /^top\s*(\d+)/i.exec(rank);
    if (top) return { pre: "top", num: top[1], suf: "" };
    const place = /^(\d+)(st|nd|rd|th)/i.exec(rank);
    if (place) return { pre: "", num: place[1], suf: place[2].toLowerCase() };
    return { pre: "", num: rank, suf: "" };
  });

  eleventyConfig.addFilter("monthYear", (isoDate) => {
    if (!isoDate) return "Delivered";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  });

  eleventyConfig.addFilter("year", (isoDate) =>
    isoDate ? String(new Date(isoDate).getFullYear()) : "Delivered",
  );

  eleventyConfig.addFilter("pad", (n, width = 2) => String(n).padStart(width, "0"));

  eleventyConfig.addFilter("byYear", (items) => {
    const groups = {};
    [...items]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((item) => {
        const y = String(new Date(item.date).getFullYear());
        (groups[y] = groups[y] || []).push(item);
      });
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map((year) => ({ year, items: groups[year] }));
  });

  eleventyConfig.addFilter("uniqueBy", (items, key) => [
    ...new Set(items.map((i) => i[key])),
  ]);

  // ---- Collections ----
  eleventyConfig.addCollection("achievementsTimeline", () => {
    const data = require("./src/_data/achievements.json");
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // Curated 4-row homepage selection: Top 2 major ("high" tier) + Last 2 most recent
  eleventyConfig.addCollection("featuredAchievements", () => {
    const data = require("./src/_data/achievements.json");
    const newestFirst = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const major = data
      .filter((x) => x.tier === "high")
      .map((x) => ({ ...x, pick: "Landmark Finish" }));
    const majorIds = new Set(major.map((x) => x.id));
    const recent = newestFirst
      .filter((x) => !majorIds.has(x.id))
      .slice(0, 2)
      .map((x) => ({ ...x, pick: "Recent Finish" }));
    return [...major, ...recent];
  });

  return {
    dir: {
      input: "src/pages",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
