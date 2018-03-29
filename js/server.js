var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
const cookieParser = require('cookie-parser');
var app = express();


function myLogger(req, res, next) {
  console.log("Raw Cookies: ",req.headers.cookie)
  console.log("Cookie Parser: ",req.cookies)
  console.log("Signed Cookies: ",req.signedCookies)
  if (req.body) {
    console.log('LOG:',req.method,req.url,req.body)
  }
   res.append('Set-Cookie', 'lastPage='+req.url);
  next()
}

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("Cookies!"));
app.use(myLogger)


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
	console.log("After post: ", req.cookies);

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});