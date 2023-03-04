// @ts-check

const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const eleventySass = require("eleventy-sass");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { join } = require("path");

/** @param {import("@11ty/eleventy/src/UserConfig")} el */
module.exports = function (el) {
    el.setUseGitIgnore(false);

    // el.addPassthroughCopy("css");
    el.addPassthroughCopy("scripts");
    el.addPassthroughCopy("images");

    el.addPlugin(syntaxHighlight);
    el.addPlugin(eleventySass);

    el.setLibrary(
        "md",
        markdownIt({ html: true }).use(/** @type {*} */ (markdownItAnchor))
    );

    el.addCollection("sorted_guides", function (collection) {
        const items = collection.getFilteredByTag("guide");
        items.sort((a, b) => a.data.menuOrder - b.data.menuOrder);
        return items;
    });

    el.addCollection("alpha_tags", function (collection) {
        const items = collection.getFilteredByTag("tag");
        items.sort((a, b) =>
            a.data.title
                .replace(/[{}]/g, "")
                .localeCompare(b.data.title.replace(/[{}]/g, ""))
        );
        return items;
    });

    el.addShortcode("typedocPlugins", () =>
        fs.readFileSync(join(__dirname, "_includes/plugin_content.txt"))
    );

    el.addShortcode("typedocThemes", () =>
        fs.readFileSync(join(__dirname, "_includes/theme_content.txt"))
    );

    return {
        pathPrefix: "/typedoc-site/",
        dir: {
            layouts: "_layouts",
        },
    };
};
