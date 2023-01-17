const os = require('os');
const path = require('path');
const fs = require('fs');

function addBlock(site_id, owner_id, blocktype, blockcontent) {
	switch (blocktype) {
		case 'text':
			file = `./../sites/site_${site_id}_${owner_id}/site_${site_id}_${owner_id}.json`
			let rawdata = fs.readFileSync(file);
			let jsonData = JSON.parse(rawdata);
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
			return;
		case 'html':
			return;
		case 'image':
			return
	}
}

module.exports = [
	addBlock
]