// Initialize Firebase
var firebase = require('firebase');

var config = {
apiKey: "AIzaSyBI4Jb71gkU1LsQYCTRu7gw769Nb7-wQoo",
authDomain: "a3default.firebaseapp.com",
databaseURL: "https://a3default.firebaseio.com",
projectId: "a3default",
storageBucket: "",
messagingSenderId: "877503307659"
};
firebase.initializeApp(config);

//get elements
//const preObject = document.getElementById('object');

//create references
const dbRefObject = firebase.database().ref().child('object');

//sync object changes
//console.log("abc");
dbRefObject.on('value', snap => console.log(snap.val()));
// ======================  ======================

var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
const cookieParser = require('cookie-parser');
var app = express();


function myLogger(req, res, next) {
  // console.log("Raw Cookies: ",req.headers.cookie)
  // console.log("Cookie Parser: ",req.cookies)
  // console.log("Signed Cookies: ",req.signedCookies)
  if (req.body) {
    console.log('LOG:',req.method,req.url,req.body)
  }
   res.append('Set-Cookie', 'lastPage='+req.url);
  next()
}

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("Pets!"));
app.use(myLogger)


// ====================== handling api/posts, R/W into DB ======================
app.get('/api/posts', function(req, res) {
  // Client requests posts

  res.send('Get request received!\n');
});

app.get('/api/posts/:id', function(req, res) {
  // Client requests a certain post
  var post_id = req.params.id;

  res.send('Get request for post: ' + post_id + ' received!\n');
});

app.post('/api/posts', function(req, res) {
  // Client submits a post
  var title = req.body.title; 
  var username = req.body.username;
  var content = req.body.content; 
  var file = req.body.file; 
  res.send('Post request received!\n');
});

app.put('/api/posts/:id', function(req, res) {
  // Client attempts to update a post
  var post_id = req.params.id;

  var title = req.body.title; 
  var username = req.body.username;
  var content = req.body.content; 
  var file = req.body.file; 

  console.log(post_id);
  res.send('Update request received!\n');
});

app.delete('/api/posts/:id', function(req, res) {
  // Client attempts to delete a post,
  // NEED to check if this post belong to this user
  var post_id = req.params.id;
  var username = req.body.username;

  console.log(post_id);
  res.send('Delete request received!\n');
});
//=============================== Web page ===============================
app.get('/', function(req, res) {
    res.cookie('securecookie', 51, {maxAge: 100000, secure: true});
    res.cookie('name', 'Tom', { signed: true });
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/css/pet_forum.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/../css/pet_forum.css'));
});

app.get('/js/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/../js/script.js'));
});

//=============================== Images ===============================
app.get('/images/:img', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/' + req.params.img));
});

app.get('/favicon.ico', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/favicon.ico'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});