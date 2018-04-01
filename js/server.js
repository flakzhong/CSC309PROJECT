
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
const dbRefObject = firebase.database().ref().child('accounts');


var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
const cookieParser = require('cookie-parser');
var app = express();

function myLogger(req, res, next) {
  console.log('------------------------------------');
  // console.log("Raw Cookies: ",req.headers.cookie)
  // console.log("Cookie Parser: ",req.cookies)
  console.log("Signed Cookies: ",req.signedCookies)
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
  var result = [];

  var ref = firebase.database().ref("posts");
  ref.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      result.push(childSnapshot.val());
    });

    res.send({'status':'Get request received!', data : result});
  });

});

app.get('/api/posts/:id', function(req, res) {
  // Client requests a certain post
  var post_id = req.params.id;

  var ref = firebase.database().ref("posts");
  ref.child(post_id).once('value').then(function(snapshot) {
    var post = snapshot.val();
    res.send(post);
  })

});

// get a user's photo
app.get('/api/photo', function (req, res) {
  firebase.database().ref().child('accounts').orderByChild('username').equalTo(req.query.username).once('value', function(snapshot) {
    var photo = snapshot.child(req.query.username + "/photo").val();
    res.send({'photo':photo});
  });
});

app.get('/api/page', function(req, res) {
  // Client requests posts

  var filter1 = req.query.first;
  var filter2 = req.query.second;

  var result = [];
  var ref = firebase.database().ref("posts").orderByChild("currentTime");
  var f1 = ref;

  var f2;
  if (filter2 == "All" && filter1 =="All") {    
    f2 = f1.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var post = {
          "postId": childSnapshot.key,
          "username" : childSnapshot.val().username,
          "title" : childSnapshot.val().title,
          "content" : childSnapshot.val().content,
          "images" : childSnapshot.val().images,
          "reply": childSnapshot.val().reply,
          "currentTime" : childSnapshot.val().currentTime
        };
        result.unshift(post);
      });
      try {
        res.send({"posts": result});
        console.log("sended");
        console.log(result);
      } catch(err) {
        
      }
    });
  } else if(filter2 == "All" && filter1 != "All"){
    f2 = f1.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.val().filter1 == filter1) {
          var post = {
            "postId": childSnapshot.key,
            "username" : childSnapshot.val().username,
            "title" : childSnapshot.val().title,
            "content" : childSnapshot.val().content,
            "images" : childSnapshot.val().images,
            "reply": childSnapshot.val().reply,
            "currentTime" : childSnapshot.val().currentTime
          };
          result.unshift(post);
        }
      });
      try {
        res.send({"posts": result});
        console.log("sended");
        console.log(result);
      } catch(err) {
        
      }
    });
  } else if(filter1 == "All" && filter2 != "All") {
    f2 = f1.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.val().filter2 == filter2) {
          var post = {
            "postId": childSnapshot.key,
            "username" : childSnapshot.val().username,
            "title" : childSnapshot.val().title,
            "content" : childSnapshot.val().content,
            "images" : childSnapshot.val().images,
            "reply": childSnapshot.val().reply,
            "currentTime" : childSnapshot.val().currentTime
          };
          result.unshift(post);
          console.log("sended");
          console.log(result);
        }
      });
      try {
        res.send({"posts": result});
        console.log("sended");
        console.log(result);
      } catch(err) {

      }
      
    });
  } else {
    f2 = f1.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.val().filter2 == filter2 && childSnapshot.val().filter1 == filter1) {
          var post = {
            "postId": childSnapshot.key,
            "username" : childSnapshot.val().username,
            "title" : childSnapshot.val().title,
            "content" : childSnapshot.val().content,
            "images" : childSnapshot.val().images,
            "reply": childSnapshot.val().reply,
            "currentTime" : childSnapshot.val().currentTime
          };
          result.unshift(post);
        }
      });
      try {
        res.send({"posts": result});
        console.log("sended");
        console.log(result);
      } catch(err) {

      }
      
    });
  }

});

app.post('/api/posts', function(req, res) {
  // Client submits a post
  var title = req.body.title; 
  var username = req.body.username;
  var content = req.body.content; 
  var images= req.body.images;
  var filter1 = req.body.filter1;
  var filter2 = req.body.filter2;
  writeNewPost(title, username, content, images, filter1, filter2);

  res.send({'success':'success'});
});

app.put('/api/posts/:id', function(req, res) {
  // Client attempts to update a post
  // can only modify 'content'
  var post_id = req.params.id;
  var content = req.body.content; 

  var ref = firebase.database().ref("posts");
  ref.child(post_id).once('value').then(function(snapshot) {
    snapshot.ref.update({ 'content': content})
  })
  
  res.send('Update request received!\n');
});

app.delete('/api/posts/:id', function(req, res) {
  // Client attempts to delete a post,
  // NEED to check if this post belong to this user
  var post_id = req.params.id;
  var username = req.body.username;

  var ref = firebase.database().ref("posts");
  ref.child(post_id).remove();

  res.send('Delete request received!\n');
});

function writeNewPost(title, username, content, images, filter1, filter2) {
  // A post entry.
  var postData = {
    title: title,
    username: username,
    content: content,
    images: images,
    filter1: filter1,
    filter2: filter2,
    currentTime: Date()
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  console.log("new post data");
  console.log(postData);

  return firebase.database().ref().update(updates);
}
// ====================== handling reply ==========================================
app.post('/api/reply', function(req, res) {
  var postId = req.body.postId;
  var username = req.body.username;
  var content = req.body.content; 
  firebase.database().ref().child('posts/' + postId + '/reply').once('value', function(snapshot) {
    var temp = snapshot.val();
    if (temp == null) {
      temp = [];
      temp.push({"username":username, "content":content});
    } else {
      temp.unshift({"username":username, "content":content});
    }
    snapshot.ref.update(temp);
    res.send({'success':"success"});
  });

});
// get all replies for a post
app.get('/api/reply', function(req, res) {
  var postId = req.query.postId;
  firebase.database().ref().child('posts/' + postId + '/reply').once('value', function(snapshot) {
    res.send({'reply':snapshot.val()});
  });
});

// ====================== handling api/accounts, R/W into DB ======================

app.get('/api/accounts/:id', function(req, res) {
  // Client requests a certain post
  var post_id = req.params.id;

  res.send('Get request for account: ' + post_id + ' received!\n');
});

app.post('/api/accounts', function(req, res) {
  // Client create an account
  var firstName = req.body.firstName; 
  var lastName = req.body.lastName;
  var email = req.body.email;
  var address = req.body.address;
  var username = req.body.username;
  var pw = req.body.password;
  var photo = req.body.photo;
  firebase.database().ref().child('accounts').orderByChild('username').equalTo(username).once('value', function(snapshot) {
    if (snapshot.val() === null) {
      createNewAccount(firstName, lastName, email, photo, address, username, pw);
      res.send({'success':"success"});
    } else{
      res.send({'success':"failed"});
    }

  });

});

app.put('/api/accounts', function(req, res) {
  // Client update account info
  var firstName = req.body.firstName; 
  var lastName = req.body.lastName;
  var email = req.body.email;
  var address = req.body.address;
  var username = req.body.username;
  var old_password = req.body.old_password;
  var new_password = req.body.new_password;
  var photo = req.body.photo;
  firebase.database().ref().child('accounts').orderByChild('username').equalTo(username).once('value', function(snapshot) {
    if (snapshot.val() === null) {
      res.send({'success':"failed"});
    } else {
      if (snapshot.child(username + '/' + 'password').val() == old_password) {
        snapshot.child(username).ref.update({'firstName': firstName})
        snapshot.child(username).ref.update({'lastName': lastName})
        snapshot.child(username).ref.update({'email': email})
        snapshot.child(username).ref.update({'address': address})
        snapshot.child(username).ref.update({'password': new_password})
        if(photo != null) {
          snapshot.child(username).ref.update({'photo': photo});
        }
        res.send({'success':"success"});
      } else {
        res.send({'success':"failed"});
      }
    }

  });

});
app.delete('/api/accounts', function(req, res) {
  // Client deletion
  var username = req.body.username;
  var pw = req.body.old_password;
  var ref = firebase.database().ref();
  var db = firebase.database();
  ref.child('accounts').orderByChild('username').equalTo(username).once('value', function(snapshot) {
    if (snapshot.child(username + '/' + 'password').val() == pw) {
      snapshot.forEach(function (childSnapshot) {
        ref.child('accounts/' + childSnapshot.key).remove();
      })
      res.send({'success':"success"});
    } else{
      res.send({'success':"failed"});
    }

  });

});

function createNewAccount(firstName, lastName, email, photo, address, username, pw) {
  // A post entry.
  var postData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    photo: photo,
    address: address,
    username: username,
    password: pw
  };

  // Get a key for a new account
  var newPostKey = firebase.database().ref().child('accounts').push().key;
  var updates = {};
  updates['/accounts/' + username] = postData;

  return firebase.database().ref().update(updates);
}

//=============================== Sessions Management ===============================
var sessions = {};

function generate_cookie_name(length) {
  var lowercase = "abcdefghijklmnopqrstuvwxyz";
  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var special_char = "~!@#$%^&*_+?";
  var candidate = lowercase + uppercase + numbers + special_char;

  var cookie_name = "";
  do {
    cookie_name = "";
    for (var i = 0; i < length; i++)
      cookie_name += candidate.charAt(Math.floor(Math.random() * candidate.length));
  } while (cookie_name in sessions);

  sessions[cookie_name] = undefined;

  return cookie_name;
}

// cookie_name can be get from req.signedCookies.name
function bind_username_to_cookie(username, cookie_name) {
  if (cookie_name != undefined && sessions[cookie_name] == undefined) {
    sessions[cookie_name] = username;
  }
}

function get_username_by_cookie(cookie_name) {
  return sessions[cookie_name]
}

function remove_username_from_sessions(cookie_name) {
  delete sessions[cookie_name];
}


// ====================== handling login ======================
app.post('/api/login', function(req, res) {
  // get username and password
  var username = req.body.username;
  var pw = req.body.password;
  firebase.database().ref().child('accounts').orderByChild('username').equalTo(username).once('value', function(snapshot) {

    if (snapshot.val() === null) {
      res.send({'success':"failed"});
    } else {
      if (snapshot.child(username + '/' + 'password').val() == pw) {
        bind_username_to_cookie(username, req.signedCookies.name);

        user_info = {}
        user_info['firstName'] = snapshot.child(username + '/' + 'firstName').val();
        user_info['lastName'] = snapshot.child(username + '/' + 'lastName').val();
        user_info['address'] = snapshot.child(username + '/' + 'address').val();
        user_info['email'] = snapshot.child(username + '/' + 'email').val();
        user_info['photo'] = snapshot.child(username + '/' + 'photo').val();
        user_info['username'] = username;

        res.send({'success':"success", "payload" : user_info});
      } else {
        res.send({'success':"failed"});
      }
    }

  });
});

app.get('/api/login', function(req, res) {
  // get username and password
  var username = get_username_by_cookie(req.signedCookies.name);

  if (!username) {
    res.send({'success':"failed"});
  } else {
    firebase.database().ref().child('accounts').orderByChild('username').equalTo(username).once('value', function(snapshot) {
      if (snapshot.val() === null) {
        res.send({'success':"failed"});
      } else {
        user_info = {}
        user_info['firstName'] = snapshot.child(username + '/' + 'firstName').val();
        user_info['lastName'] = snapshot.child(username + '/' + 'lastName').val();
        user_info['address'] = snapshot.child(username + '/' + 'address').val();
        user_info['email'] = snapshot.child(username + '/' + 'email').val();
        user_info['photo'] = snapshot.child(username + '/' + 'photo').val();
        user_info['username'] = username;

        res.send({'success':"success", "payload" : user_info});
      }

    });    
  }
});
//=== logout ===
app.post('/api/logout', function(req, res) {
  remove_username_from_sessions(req.signedCookies.name);
  res.send({'success':"failed"});
});

//=============================== Web page ===============================
app.get('/', function(req, res) {
  if (req.signedCookies.name == undefined || !(req.signedCookies.name in sessions)) {
    res.cookie('securecookie', 51, {maxAge: 100000, secure: true});
    res.cookie('name', generate_cookie_name(20), { signed: true });
  }
  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/css/pet_forum.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/../css/pet_forum.css'));
});

app.get('/js/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/../js/script.js'));
});

app.get('/js/card.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/../js/card.js'));
});

//=============================== Files ===============================
app.get('/images/:img', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/' + req.params.img));
});

app.get('/lib/:file', function(req, res) {
  res.sendFile(path.join(__dirname + '/../lib/' + req.params.file));
});

app.get('/favicon.ico', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/favicon.ico'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});