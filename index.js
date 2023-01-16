var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require ('path');
const { syncBuiltinESMExports } = require('module');
var sites = []
app.use(bodyParser.json());
app.set('view engine', 'ejs');

function findSite(id) { 
	var found = sites.filter(function(item) { return item.id === id; });
	return found[0]
}

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/post/:id', function(req, res) {
  res.render('site', { site: findSite(req.params.id) });
});
app.post('/api/new/site', function(req, res) {
		sites.push(req.body)
		res.status(201).json({"msg": "created new website :tada:", "id": req.body.id})
	
})
app.post('/api/update/site', function (req, res) {
	var siteIndex = sites.findIndex((obj => obj.id == req.body.id));
	sites[siteIndex].content = req.body.content
	res.status(201).json({"msg": `updated site ${req.body.id} #${siteIndex}`})
})

app.listen(3000);
console.log('znci-web listening on 3000');