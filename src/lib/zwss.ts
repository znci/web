//
// ZWSS (znci web site schema) is a simple markup language for describing a web site.
// It is used by znci/web to parse a web site and return viewable HTML in a browser.
//

import yaml from "yaml";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { ZwssYaml, Block } from "../types/types.js";

type zwss = {
  validateObject: (doc: object) => object;
  validateString: (contents: string) => object;
  render: (contents: string) => string;
  generate: () => { contents: string; id: string };
  addBlock: (contents: string, block: object) => string;
  removeBlock: (oldContents: string, index: number) => string;
};

let zwss: zwss = {} as zwss;

/**
 * Validate a ZWSS file from an object
 * @param {object} doc ZWSS object
 * @returns ZWSS object
 * @throws {Error} Will throw an error if the document does not match the schema
 */
zwss.validateObject = function (doc) {
  const schema = z.object({
    type: z.string(),
    title: z.string(),
    id: z.string().uuid(),
    body: z.object({
      blocks: z
        .union([
          z.object({
            type: z.literal("heading"),
            text: z.string(),
          }),
          z.object({
            type: z.literal("paragraph"),
            text: z.string(),
          }),
          z.object({
            type: z.literal("image"),
            url: z.string().url(),
            alt: z.string(),
          }),
          z.object({
            type: z.literal("link"),
            url: z.string().url(),
            text: z.string(),
          }),
        ])
        .array(),
    }),
  });

  return schema.parse(doc);
};

/**
 * Validate a ZWSS file from a string
 * @param {string} contents
 * @returns ZWSS object
 * @throws {Error} Will throw an error if the document does not match the schema
 */
zwss.validateString = function (contents): ZwssYaml {
  let doc;

  try {
    doc = yaml.parse(contents);
  } catch (e) {
    throw new Error("Invalid ZWSS file.");
  }

  return zwss.validateObject(doc)! as ZwssYaml;
};

/**
 * Render a ZWSS file to HTML.
 * @param {string} contents ZWSS formatted YAML
 * @returns HTML site
 * @throws {Error} Will throw an error if the document is invalid
 */
zwss.render = function (contents) {
  let doc: ZwssYaml;

  try {
    doc = zwss.validateString(contents)! as ZwssYaml;
  } catch (e) {
    throw new Error(`Invalid ZWSS file: ${e}`);
  }

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
        html += `<p>${doc.body.blocks[i].text!.replaceAll(
          "\n",
          "<br />"
        )}</p>\n`;
      }
      if (doc.body.blocks[i].type == "image") {
        html += `<img src="${doc.body.blocks[i].url}" alt="${doc.body.blocks[i].alt}" />\n`;
      }
      if (doc.body.blocks[i].type == "link") {
        html += `<a href="${doc.body.blocks[i].url}">${doc.body.blocks[i].text}</a>\n`;
      }
    }

    html += `
    </body>
    </html>`;
  }

  return html;
};

/**
 * @typedef {Object} GenerateReturn
 * @property {string} contents ZWSS formatted YAML
 * @property {string} id UUID of the page
 */

/**
 * Generate a new ZWSS file. (simple Hello World! Welcome to ZWSS!)
 * @return {GenerateReturn} ZWSS formatted YAML and UUID of the page
 */
zwss.generate = function () {
  let doc = {
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

  return {
    contents: yaml.stringify(doc),
    id: doc.id,
  };
};

/**
 * Add a block to a ZWSS file.
 * @param {string} contents ZWSS formatted YAML
 * @param {object} block Block to add
 * @returns ZWSS formatted YAML
 */
zwss.addBlock = function (contents, block) {
  let doc: ZwssYaml;

  try {
    doc = zwss.validateString(contents)! as ZwssYaml;
  } catch (e) {
    throw new Error(e as unknown as string);
  }

  doc.body.blocks.push(block as unknown as Block);

  try {
    zwss.validateString(doc as unknown as string);
  } catch (e) {
    throw new Error(e as unknown as string);
  }

  return yaml.stringify(doc);
};

/**
 * Remove a block from a ZWSS file.
 * @param {string} oldContents ZWSS formatted YAML
 * @param {number} index Index of block to remove
 * @returns ZWSS formatted YAML
 */
zwss.removeBlock = function (oldContents, index) {
  let doc;

  try {
    doc = yaml.parse(oldContents);
  } catch (e) {
    throw new Error("Invalid ZWSS file.");
  }

  if (index > doc.body.blocks.length) {
    throw new Error("Invalid index.");
  }

  doc.body.blocks.splice(index, 1);
  return yaml.stringify(doc);
};

export { zwss };
