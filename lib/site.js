const os = require("os");
const path = require("path");
const fs = require("fs");
const random = require("random");
function getSite(user, id) {
  fs.readFile(`./../sites/site_${id}_${user}`, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log(`got site ${id}`);
    return jsonString;
  });
}

function createSite(ownerObject, editors, meta) {
  var siteObject = {
    type: "site",
    ownerObject,
    id: random.int(1000, 9000),
    meta,
    blacklisted: false,
    permission: 0,
    editors,
  };
  var jsonString = JSON.stringify(siteObject, null, 4);
  var dir = `./../sites/site_${siteObject.id}_${siteObject.ownerObject.id}/`;
  fs.mkdirSync(dir);
  fs.writeFile(
    `./../sites/site_${siteObject.id}_${siteObject.ownerObject.id}/site_${siteObject.id}_${siteObject.ownerObject.id}.json`,
    jsonString,
    (err) => {
      if (err) {
        console.log("unable to create site: ", err);
      } else {
        console.log(`site ${siteObject.id} created`);
      }
    }
  );
}

// demo: createSite({"id": 0},[],{"title": "My Awesome Website","content": [{"block":"text","content":"string","id":0}]})
module.exports = [createSite, getSite];
