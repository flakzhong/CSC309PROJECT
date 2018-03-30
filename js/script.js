var URL = "https://3f2770f9.ngrok.io"

var title = "Corgi!!!";
var content = "The best way to raise a Corgi";
var file = "Placeholder: filename or file, not working now";

$(function(){
    $('form#post').submit((event) => {
        $.ajax({
          url: URL+"/api/posts",
          type: "POST",
          data: {'title' : title, 
                'content': content,
                'file'   : file,
                'username' : "Tommy"},
          dataType: "json"
        });
    });
});

// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBI4Jb71gkU1LsQYCTRu7gw769Nb7-wQoo",
//     authDomain: "a3default.firebaseapp.com",
//     databaseURL: "https://a3default.firebaseio.com",
//     projectId: "a3default",
//     storageBucket: "",
//     messagingSenderId: "877503307659"
// };

// firebase.initializeApp(config);

// //get elements
// const preObject = document.getElementById('object');

// //create references
// const dbRefObject = firebase.database().ref().child('object');

// //sync object changes
// //console.log("abc");
// dbRefObject.on('value', snap => console.log(snap.val()));

var currentPage = 0
var currentFilter = 0
var currentUser=""
// after log in, log in button should be hidden.
// and log in is replaced by my account
function account(evt) {
    if (currentUser == "") {
        var loginbar = document.getElementById("loginbar")
        loginbar.style.display = "block"
    } else {
        
    }
}


function login(evt) {
    username = document.getElementById("userid").value;
    password = document.getElementById("userpass").value;
    var success = 0;
    $(function(){
        $.ajax({
            url: "https://a285392a.ngrok.io/api/login",
            type: "POST",
            data: {'username': username,
                'password': password},
            dataType: "json",
            success: function(response) {
                if(response['success'] == 'failed') {
                    alert("Failed to login. Please check your username and password.");
                } else {
                    success = 1;
                    if (success) {
                        currentUser = username
                        welcome = document.getElementById("hello-info")
                        welcome.style.display = "block"
                        welcome.innerHTML = "Welcome, " + username;
                        loginbar = document.getElementById("loginbar")
                        loginbar.style.display = "none"
                        account = document.getElementById("myacc")
                        account.innerHTML = "My Account"
                        account.href="#userprofile"
                        // hide register button
                        document.getElementById("registerButton").style.display = "none";
                        // document.cookie = "username=" + username;
                    }
                }
            }
        });
    });


}


// global variable to save the navigation bars' status for forum.
var allUpper = ["upperAll", "Adoption", "Lost", "upperOthers"];
var allLower = ["lowerAll", "Dog", "Cat", "lowerOthers"];
var currUpper = "upperAll";
var currLower = "lowerAll";


function openSubNav(evt, tabName) {
    var i;
    var tabcontent = document.getElementsByClassName("forumtabcontent");


    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // update nav bar's status
    // this is the situation that upper button is clicked
    if (allUpper.includes(tabName)) {
        var realCurrUpper = document.getElementById(currUpper);
        realCurrUpper.className = realCurrUpper.className.replace(" active", "");
        currUpper = tabName;

    // lower button is clicked
    } else if (allLower.includes(tabName)) {
        var realCurrLower = document.getElementById(currLower);
        realCurrLower.className = realCurrLower.className.replace(" active", "");
        currLower = tabName;
    }
    // all the posts are rendered in the div post
    var tab = document.getElementById("posts");
    var dataRows = document.getElementById("postTable");//getElementsByClassName("forumtabcontent");

    // for now just render fake posts.
    tab.style.display = "block";

    for (i = 0; i < dataRows.rows.length; i++) {
        if (i == 0){
            for (var j = 1; j < dataRows.rows.length; j++){
                dataRows.rows[j].style.display = "none";
            }
        }
        if (i > 0){// skip when i = 0 since it's the table header
            //for (var j = 0; j < dataRows[i].cells.length; j++) {
            //    window.alert(dataRows[i].cells.item(j).innerHTML);
            //}
            //window.alert(currLower);
            if (currUpper == "upperAll"){
                if (currLower == "lowerAll"){
                    //window.alert(currLower + currUpper);
                    //tab.style.display = "block";
                    dataRows.rows[i].style.display = "table-row";
                    //break;
                    //
                    
                } else if (dataRows.rows[i].cells.item(0).innerHTML.indexOf(currLower) != -1){
                    //window.alert(dataRows.rows[i].innerHTML);

                    dataRows.rows[i].style.display = "table-row";
                }
            } else {
                if (currLower == "lowerAll"){
                    if (dataRows.rows[i].cells.item(1).innerHTML.indexOf(currUpper) != -1){
                        dataRows.rows[i].style.display = "table-row";
                    }

                } else if (dataRows.rows[i].cells.item(1).innerHTML.indexOf(currUpper) != -1 && dataRows.rows[i].cells.item(0).innerHTML.indexOf(currLower) != -1){

                dataRows.rows[i].style.display = "table-row";
            }
        }
            /*else if (currentUpper = "upperAll"){

            }
            if (dataRows[i].cells.item(0).innerHTML.indexOf(currLower) != -1){
                if (dataRows[i].cells.item(0).innerHTML.indexOf(currUpper) != -1){
                    window.alert(1);
                }
            }*/
        }
        //console.log(dataRows)
        //if (dataRows[i].innerHTML.indexOf("Dog") != -1){
        //    dataRows[i].innerHTML = "hahahaha";
            //dataRows[i].style.display = "None";
       // }

    }
        //i.style.display = "None";
    //tab.innerHTML = petType;//currUpper + currLower;
    
    //dataRows[0].style.display = "None";

    evt.currentTarget.className += " active";
}

/* =======================user profile======================= */
/* sry I'm getting  'Uncaught ReferenceError: $ is not defined' therefore I commented out this part for now
$(document).ready(function () {

    $(".edit").hide();

    $(".edit_profile").click(function() {
    	$(".user").hide();
    	$(".edit").show();
    });

    $(".save_profile").click(function() {
    	$(".user").show();
    	$(".edit").hide();
    });

});*/

function register() {
    var firstName = document.getElementById("rFirstName").value;
    var lastName = document.getElementById("rLastName").value;
    var address = document.getElementById("rAddress").value;
    var email = document.getElementById("rEmail").value;
    var username = document.getElementById("rUsername").value;
    var pw = document.getElementById("rPassword").value;
    var cpw = document.getElementById("rCPassword").value;
    var correct = 1;
    
    if (firstName.length == 0) {
        alert("Invalid first name.")
        correct = 0;
    }
    if (lastName.length == 0) {
        alert("Invalid last name.")
        correct = 0;
    }
    if (address.length == 0) {
        alert("Invalid address")
        correct = 0;
    }
    if (email.length == 0 || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        alert("Invalid email address")
        correct = 0;
    }
    if (username.length < 5) {
        alert("Username too short")
        correct = 0;
    }
    if (pw.length < 5) {
        alert("Password too simple")
        correct = 0;
    }
    if (pw != cpw) {
        alert("Confirm password does not match password.")
        correct = 0;
    }
    if (correct == 1) {
        $(function(){
            console.log("ajax is about to run...")
            $.ajax({
              url: "https://a285392a.ngrok.io/api/accounts",
              type: "POST",
              data: {'firstName' : firstName, 
                    'lastName': lastName,
                    'address': address,
                    'email': email,
                    'username': username,
                    'password': pw},
              dataType: "json",
              success: function(response) {
                  if (response['success'] != 'success') {
                    alert("Username already exist.");
                  } else {
                    alert("Registered.")
                  }       
              }
            });
        });
    }
}

function myacc() {
    
}