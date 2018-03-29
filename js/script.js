var title = "Corgi!!!";
var content = "The best way to raise a Corgi";
var file = "Placeholder: filename or file, not working now";

console.log("script.js is running...");

$(function(){
    console.log("ajax is about to run...")
    $.ajax({
      url: "http://9726e14f.ngrok.io/api/posts",
      type: "POST",
      data: {'title' : title, 
            'content': content,
            'file'   : file},
      dataType: "json"
    });
});


// Initialize Firebase
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
const preObject = document.getElementById('object');

//create references
const dbRefObject = firebase.database().ref().child('object');

//sync object changes
//console.log("abc");
dbRefObject.on('value', snap => console.log(snap.val()));

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

// fake login button
// only takes username user and password pass
function login(evt) {
    username = document.getElementById("userid").value
    password = document.getElementById("userpass").value
    if (username == "user" && password == "pass") {
        currentUser = username
        welcome = document.getElementById("hello-info")
        welcome.style.display = "block"
        welcome.innerHTML = "Welcome, User"
        loginbar = document.getElementById("loginbar")
        loginbar.style.display = "none"
        account = document.getElementById("myacc")
        account.innerHTML = "My Account"
        account.href="#userprofile"
        // hide register button
        document.getElementById("registerButton").style.display = "none";
    }

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

function makePost() {
    var submitButton = document.getElementById('post');
    var title = document.getElementById("postTitle").value;
    console.log(title);
    var content = document.getElementById("postContent").value;
    console.log(content);
    if (title.length < 5) {
        alert("Title too short.");
    }

    if (content.length < 5) {
        alert("Content too short.")
    }
    var images = document.getElementById("postImgUpload").files;

}