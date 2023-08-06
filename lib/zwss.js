//
// ZWSS (znci web site schema) is a simple markup language for describing a web site.
// It is used by znci/web to parse a web site and return viewable HTML in a browser.
//

const yaml = require("yaml");
const uuidv4 = require("uuid").v4;

let zwss = {};

/**
 * Render a ZWSS file to HTML.
 * @param {*} contents ZWSS formatted YAML
 * @returns HTML site
 */
zwss.render = function (contents) {
  let doc = yaml.parse(contents);
  let html = "";

  if (doc.type == "page") {
    html += `<!DOCTYPE html>
    <html>
    <head>
    <title>${doc.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/hosted/rs/tc.css">
    ${
      doc.personalStylesheet
        ? `<link rel="stylesheet" href="/public/hosted/${doc.personalStylesheet}">`
        : ""
    }
    </head>
    <body>`;

    for (var i = 0; i < doc.body.blocks.length; i++) {
      if (doc.body.blocks[i].type == "heading") {
        html += `<h1>${doc.body.blocks[i].text}</h1>\n`;
      }
      if (doc.body.blocks[i].type == "paragraph") {
        html += `<p>${doc.body.blocks[i].text}</p>\n`;
      }
      if (doc.body.blocks[i].type == "image") {
        html += `<img src="${doc.body.blocks[i].url}" alt="${doc.body.blocks[i].alt}" />\n`;
      }
      if (doc.body.blocks[i].type == "link") {
        html += `<a href="${doc.body.blocks[i].url}">${doc.body.blocks[i].text}</a>\n`;
      }
    }

    html += `<script src="/hosted/rs/tc.js"></script>
    </body>
    </html>`;
  }

  return html;
};

/**
 * Generate a new ZWSS file. (simple Hello World! Welcome to ZWSS!)
 * @return {string} The ZWSS file as ZWSS formatted YAML.
 */
zwss.generate = function () {
  return {
    type: "page",
    title: "Hello World!",
    id: uuidv4(),
    body: {
      blocks: [
        {
          type: "heading",
          text: "Welcome to ZWSS!",
        },
        {
          type: "paragraph",
          text: "This is a ZWSS file.\n\nZWSS is a simple schema for describing a web site.\n\nIt is used by znci/web to parse a web site and return viewable HTML in a browser.\n\nIt is powered by a custom parser.",
        },
      ],
    },
  };
};

/**
 * Add a block to a ZWSS file.
 * @param {string} oldContents ZWSS formatted YAML
 * @param {object} block Block to add
 * @returns ZWSS formatted YAML
 */
zwss.addBlock = function (oldContents, block) {
  if (
    !block.type === "heading" ||
    !block.type === "paragraph" ||
    !block.type === "image" ||
    !block.type === "link"
  ) {
    throw new Error("Invalid block type.");
  }

  let doc = yaml.parse(oldContents);

  if (block.text) {
    doc.body.blocks.push(block);
    return yaml.stringify(doc);
  } else {
    throw new Error("Block must have text.");
  }
};

/**
 * Remove a block from a ZWSS file.
 * @param {string} oldContents ZWSS formatted YAML
 * @param {number} index Index of block to remove
 * @returns ZWSS formatted YAML
 * @todo Add error handling.
 * @todo Add check to make sure index is valid.
 */
zwss.removeBlock = function (oldContents, index) {
  let doc = yaml.parse(oldContents);
  doc.body.blocks.splice(index, 1);
  return yaml.stringify(doc);
};

module.exports = zwss;
