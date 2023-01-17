const os = require('os');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
function addBlock(site_id, owner_id, blocktype, blockcontent) {
	switch (blocktype) {
		case 'text':
			file = `./../sites/site_${site_id}_${owner_id}/site_${site_id}_${owner_id}.json`
			var rawdata = fs.readFileSync(file);
			var jsonData = JSON.parse(rawdata);
			var id = Object.keys(jsonData.meta.content).length
			console.log(id)
			var block = {"block": "text", "content": blockcontent, "id": id}
			jsonData.meta.content.push(block)
			finalJson = JSON.stringify(jsonData, null, 4)
			fs.writeFile(`${file}`, finalJson, err => {
				if (err) {
					console.log('unable to update site: ', err)
				} else {
					console.log(`site ${site_id} updated`)
				}
			})
			return;
		case 'markdown':
			file = `./../sites/site_${site_id}_${owner_id}/site_${site_id}_${owner_id}.json`
			var rawdata = fs.readFileSync(file);
			var jsonData = JSON.parse(rawdata);
			var id = Object.keys(jsonData.meta.content).length
			console.log(id)
			var block = {"block": "markdown", "content": `${marked.parse(blockcontent)}`, "id": id}
			jsonData.meta.content.push(block)
			finalJson = JSON.stringify(jsonData, null, 4)
			fs.writeFile(`${file}`, finalJson, err => {
				if (err) {
					console.log('unable to update site: ', err)
				} else {
					console.log(`site ${site_id} updated`)
				}
			})
			return;
		case 'html':
			file = `./../sites/site_${site_id}_${owner_id}/site_${site_id}_${owner_id}.json`
			var rawdata = fs.readFileSync(file);
			var jsonData = JSON.parse(rawdata);
			var id = Object.keys(jsonData.meta.content).length
			console.log(id)
			var block = {"block": "custom", "content": `${blockcontent}`, "id": id} // TODO: sanitize input
			jsonData.meta.content.push(block)
			finalJson = JSON.stringify(jsonData, null, 4)
			fs.writeFile(`${file}`, finalJson, err => {
				if (err) {
					console.log('unable to update site: ', err)
				} else {
					console.log(`site ${site_id} updated`)
				}
			})
			return;
		case 'image':
			file = `./../sites/site_${site_id}_${owner_id}/site_${site_id}_${owner_id}.json`
			var rawdata = fs.readFileSync(file);
			var jsonData = JSON.parse(rawdata);
			var id = Object.keys(jsonData.meta.content).length
			console.log(id)
			var block = {"block": "image", "content": `<img src=${blockcontent}></img>`, "id": id}
			jsonData.meta.content.push(block)
			finalJson = JSON.stringify(jsonData, null, 4)
			fs.writeFile(`${file}`, finalJson, err => {
				if (err) {
					console.log('unable to update site: ', err)
				} else {
					console.log(`site ${site_id} updated`)
				}
			})
			return;
	}
}
// testmd = 'https://google.com'
// addBlock(8199, 0, 'image', testmd)
module.exports = [
	addBlock
]