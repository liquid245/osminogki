module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Фильтр для чтения MD файлов
  eleventyConfig.addFilter("readMarkdown", async function(path) {
    const fs = require('fs').promises;
    const frontmatter = require('gray-matter');
    const content = await fs.readFile(path, 'utf8');
    return frontmatter(content);
  });

  // Фильтр для сортировки блоков
  eleventyConfig.addFilter("sortBlocks", function(blocks, order) {
    if (!order) return blocks.sort((a, b) => a.file.localeCompare(b.file));

    const ordered = [];
    const remaining = [...blocks];

    // Сначала добавляем в указанном порядке
    for (const item of order) {
      const index = remaining.findIndex(b => b.file === item);
      if (index !== -1) {
        ordered.push(remaining[index]);
        remaining.splice(index, 1);
      }
    }

    // Остальные в алфавитном порядке
    remaining.sort((a, b) => a.file.localeCompare(b.file));
    return [...ordered, ...remaining];
  });

  return {
    dir: {
      input: "_products",
      output: "_dist",
      includes: "../_includes",
      layouts: "../_layouts",
      data: "../_data"
    }
  };
};
