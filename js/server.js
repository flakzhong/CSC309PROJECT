var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ====================== handling POST at /posts ======================
app.post('/api/posts', function(req, res) {
	console.log('received post');
	var title = req.body.title; 
	var content = req.body.content; 
	var file = req.body.file; 
	console.log(title);
	console.log(content);
	console.log(file);
	res.send('Post received!');
});

//=============================== Web page ===============================
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/css/pet_forum.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/../css/pet_forum.css'));
});

app.get('/js/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/../js/script.js'));
});

//=============================== Images ===============================
app.get('/images/back.png', function(req, res) {
    res.sendFile(path.join(__dirname + '/../images/back.png'));
});

app.get('/images/logo.png', function(req, res) {
    res.sendFile(path.join(__dirname + '/../images/logo.png'));
});

app.get('/images/panda.jpg', function(req, res) {
    res.sendFile(path.join(__dirname + '/../images/panda.jpg'));
});

app.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname + '/../images/favicon.ico'));
});

app.listen(3000);