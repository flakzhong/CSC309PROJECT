var express = require('express');
var app = express();
var path = require('path');

//=============================== Web page ===============================
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/css/pet_forum.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/css/pet_forum.css'));
});

app.get('/js/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/script.js'));
});

//=============================== Images ===============================
app.get('/back.png', function(req, res) {
    res.sendFile(path.join(__dirname + '/back.png'));
});

app.get('/logo.png', function(req, res) {
    res.sendFile(path.join(__dirname + '/logo.png'));
});

app.get('/panda.jpg', function(req, res) {
    res.sendFile(path.join(__dirname + '/panda.jpg'));
});

app.listen(3000);