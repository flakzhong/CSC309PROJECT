var URL = "https://7ced8bcb.ngrok.io"


$(function(){
    $.ajax({
        url: URL + "/api/login",
        type: "GET",
        dataType: false,
        success: function(response) {
            if(response['success'] == 'success') {
                put_account_info(response.payload);
                currentUser = response.payload.username
                welcome = document.getElementById("hello-info")
                welcome.style.display = "block"
                welcome.innerHTML = "Welcome, " + response.payload.username;
                loginbar = document.getElementById("loginbar")
                loginbar.style.display = "none"
                account = document.getElementById("myacc")
                account.innerHTML = "My Account"
                account.href="#userprofile"
                // hide register button
                document.getElementById("registerButton").style.display = "none";
                // u can make posts after logging in.
                document.getElementById("makeposts").style.display = "block";
            }
        }
    });
});

var currentUser=""

function login(evt) {
    username = document.getElementById("userid").value;
    password = document.getElementById("userpass").value;
    var success = 0;
    $(function(){
        $.ajax({
            url: URL + "/api/login",
            type: "POST",
            data: {'username': username,
                'password': password},
            dataType: "json",
            success: function(response) {
                if(response['success'] == 'failed') {
                    console.log("success")
                    alert("Failed to login. Please check your username and password.");
                } else {
                    console.log("success")
                    put_account_info(response.payload);
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
                    // after logged in, u can make posts.
                    document.getElementById("makeposts").style.display = "block";
                }
            }
        });
    });


}

function put_account_info(user_info) {
    $('#editFName').val(user_info.firstName);
    $('#editLName').val(user_info.lastName);
    $('#editAddress').val(user_info.address);
    $('#editEmail').val(user_info.email);
    $('#userPhoto').attr("src", user_info.photo);
    $('#myaccUsername').text("Username: "+user_info.username);
}

// global variable to save the navigation bars' status for forum.
var allUpper = ["upperAll", "Adoption", "Lost", "upperOthers"];
var allLower = ["lowerAll", "Dog", "Cat", "lowerOthers"];
var currUpper = "upperAll";
var currLower = "lowerAll";


function register() {
    var firstName = document.getElementById("rFirstName").value;
    var lastName = document.getElementById("rLastName").value;
    var address = document.getElementById("rAddress").value;
    var email = document.getElementById("rEmail").value;
    var username = document.getElementById("rUsername").value;
    var pw = document.getElementById("rPassword").value;
    var cpw = document.getElementById("rCPassword").value;
    var photo = "https://res.cloudinary.com/dfpktpjp8/image/upload/v1522528152/qm8qtuayijxdfj1t4jco.jpg";
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
              url: URL + "/api/accounts",
              type: "POST",
              data: {'firstName' : firstName, 
                    'lastName': lastName,
                    'address': address,
                    'email': email,
                    'photo': photo,
                    'username': username,
                    'password': pw},
              dataType: "json",
              success: function(response) {
                  if (response['success'] != 'success') {
                    alert("Username already exist.");
                  } else {
                    $('#rFirstName').val("");
                    $('#rLastName').val("");
                    $('#rAddress').val("");
                    $('#rEmail').val("");
                    $('#rUsername').val("");
                    $('#rPassword').val("");
                    $('#rCPassword').val("");
                    alert("Registered.")
                  }       
              }
            });
        });
    }
}


function makePost() {
    var submitButton = document.getElementById('post');
    var title = document.getElementById("postTitle").value;
    var content = document.getElementById("postContent").value;
    if (title.length < 5) {
        alert("Title too short.");
    }

    if (content.length < 5) {
        alert("Content too short.")
    }
    var images = document.getElementById("postImgUpload").files;
    if (images.length > 0) {
        var img_url = [];
        for(var i = 0; i < images.length; i++) {
            var formData = new FormData();
            formData.append('file', images[i]);
            formData.append('upload_preset', 'tsqi28bt');
            axios({
                url: "https://api.cloudinary.com/v1_1/dfpktpjp8/image/upload",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }).then(function(res) {
                img_url.push(res['data']['secure_url']);
                    if (img_url.length == images.length) {
                        $(function(){
                            $.ajax({
                                url: URL + "/api/posts",
                                type: "POST",
                                data: {
                                    title: title,
                                    username: currentUser,
                                    content: content,
                                    images: img_url,
                                    filter1: "filter1",
                                    filter2: "filter2"
                                },
                                dataType: "json",
                                success: function(response) {
                                    if (response['success'] != 'success') {
                                        alert("failed to post");
                                    } else {
                                        $("#postTitle").val("");
                                        $("#postContent").val("");
                                        $("#postImgUpload").val(null);
                                        alert("posted")
                                    }       
                                }
                            });
                        });
                    }
            }).catch(function(err) {
                console.log(err);
            });
        }
    } else {
        $(function(){
            $.ajax({
                url: URL + "/api/posts",
                type: "POST",
                data: {
                    title: title,
                    username: currentUser,
                    content: content,
                    images: null,
                    filter1: "filter1",
                    filter2: "filter2"
                },
                dataType: "json",
                success: function(response) {
                    if (response['success'] != 'success') {
                    alert("failed to post");
                    } else {
                    alert("posted")
                    }       
                }
            });
        });
    }

}

function editProfile() {
    var firstName = document.getElementById("editFName").value;
    var lastName = document.getElementById("editLName").value;
    var address = document.getElementById("editAddress").value;
    var email = document.getElementById("editEmail").value;
    var oPw = document.getElementById("Opassword").value;
    var nPw = document.getElementById("newPassword").value;
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
    if (nPw.length < 5){
        correct = 0;
        alert("New password too short.")
    }
    
    if (correct == 1 && document.getElementById("editPhoto").files.length == 0) {
        // This ajax is used for updating account info
        $(function(){
            $.ajax({
            url: URL + "/api/accounts",
            type: "PUT",
            data:   {'firstName' : firstName, 
                        'lastName': lastName,
                        'address': address,
                        'email': email,
                        'username': currentUser,
                        'old_password': oPw,
                        'new_password': nPw},
            dataType: "json",
            success: function(response) {
                if (response["success"] == "success") {
                    alert("Profile changed");
                } else {
                    alert("Failed to change profile. Please make sure that you type the correct old password.")
                }
            }
            });
        });
    } else if(correct == 1 && document.getElementById("editPhoto").files.length == 1) {
        var formData = new FormData();
        formData.append('file', document.getElementById("editPhoto").files[0]);
        formData.append('upload_preset', 'tsqi28bt');
        axios({
            url: "https://api.cloudinary.com/v1_1/dfpktpjp8/image/upload",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData
        }).then(function(res) {
            $(function(){
                $.ajax({
                url: URL + "/api/accounts",
                type: "PUT",
                data:   {'firstName' : firstName, 
                            'lastName': lastName,
                            'address': address,
                            'email': email,
                            'username': currentUser,
                            'photo': res['data']['secure_url'],
                            'old_password': oPw,
                            'new_password': nPw},
                dataType: "json",
                success: function(response) {
                    if (response["success"] == "success") {
                        $('#editPhoto').val(null);
                        alert("Profile changed");
                    } else {
                        alert("Failed to change profile. Please make sure that you type the correct old password.")
                    }
                }
                });
            });
        })
    }
}

