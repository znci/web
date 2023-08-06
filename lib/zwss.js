//
// ZWSS (znci web site schema) is a simple markup language for describing a web site.
// It is used by znci/web to parse a web site and return viewable HTML in a browser.
//

const yaml = require("yaml");
const uuidv4 = require("uuid").v4;

var zwss = {};

/**
 * Render a ZWSS file to HTML.
 * @param {*} obj ZWSS formatted YAML
 * @returns HTML site
 */
zwss.render = function (obj) {
  obj = yaml.parse(obj);
  var html = "";
  if (obj.type == "page") {
    html += "<!DOCTYPE html>\n";
    html += "<html>\n";
    html += "<head>\n";
    html += "<title>" + obj.title + "</title>\n";
    html +=
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>\n";
    html += "<link rel='stylesheet' href='/hosted/rs/tc.css'>\n";
    if (obj.personalStylesheet) {
      html +=
        '<link rel="stylesheet" href="/public/hosted/"' +
        obj.personalStylesheet +
        ">\n";
    }
    html += "</head>\n";
    html += "<body>\n";
    for (var i = 0; i < obj.body.blocks.length; i++) {
      if (obj.body.blocks[i].type == "heading") {
        html += "<h1>" + obj.body.blocks[i].text + "</h1>\n";
      }
      if (obj.body.blocks[i].type == "paragraph") {
        html += "<p>" + obj.body.blocks[i].text + "</p>\n";
      }
      if (obj.body.blocks[i].type == "image") {
        html +=
          "<img src='" +
          obj.body.blocks[i].url +
          "' alt='" +
          obj.body.blocks[i].alt +
          "' />\n";
      }
      if (obj.body.blocks[i].type == "link") {
        html +=
          "<a href='" +
          obj.body.blocks[i].url +
          "'>" +
          obj.body.blocks[i].text +
          "</a>\n";
      }
    }
    html += "<script src='" + "/hosted/rs/tc.js" + "'></script>\n";
    html += "</body>\n";
    html += "</html>\n";
  }
  return html;
};

/**
 * Generate a new ZWSS file. (simple Hello World! Welcome to ZWSS!)
 * @return {string} The ZWSS file as ZWSS formatted YAML.
 */
zwss.generate = function () {
  var obj = {};
  obj.type = "page";
  obj.title = "Hello World!";
  obj.id = uuidv4();
  obj.body = {};
  obj.body.blocks = [];
  obj.body.blocks[0] = {};
  obj.body.blocks[0].type = "heading";
  obj.body.blocks[0].text = "Welcome to ZWSS!";
  obj.body.blocks[1] = {};
  obj.body.blocks[1].type = "paragraph";
  obj.body.blocks[1].text =
    "This is a ZWSS file.\n\nZWSS is a simple schema for describing a web site.\n\nIt is used by znci/web to parse a web site and return viewable HTML in a browser.\n\nIt is powered by a custom parser.";

  return yaml.stringify(obj);
};

/**
 * Add a block to a ZWSS file.
 * @param {string} zwss ZWSS formatted YAML
 * @param {object} block Block to add
 * @returns ZWSS formatted YAML
 */
zwss.addBlock = function (zwss, block) {
  // Check to make sure it is a valid block (has type: heading, paragraph, image, link) and has text.
  if (
    block.type == "heading" ||
    block.type == "paragraph" ||
    block.type == "image" ||
    block.type == "link"
  ) {
    if (block.text) {
      // Parse the ZWSS file.
      var obj = yaml.parse(zwss);
      // Add the block to the body.
      obj.body.blocks.push(block);
      // Return the ZWSS formatted YAML.
      return yaml.stringify(obj);
    }
  } else {
    new Error("Invalid block type.");
  }
};

/**
 * Remove a block from a ZWSS file.
 * @param {string} zwss ZWSS formatted YAML
 * @param {number} index Index of block to remove
 * @returns ZWSS formatted YAML
 * @todo Add error handling.
 * @todo Add check to make sure index is valid.
 */
zwss.removeBlock = function (zwss, index) {
  // Parse the ZWSS file.
  var obj = yaml.parse(zwss);
  // Remove the block from the body.
  obj.body.blocks.splice(index, 1);
  // Return the ZWSS formatted YAML.
  return yaml.stringify(obj);
};

module.exports = zwss;
