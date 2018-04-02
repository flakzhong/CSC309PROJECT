var URL = "https://cscdefault01.ngrok.io"
var currentUser=""
 
 if (window.location.hash == '') { 
     window.location.href = URL + '/#forum'; 
 } 
/*
	Avoid logging out the user after reloading the page using cookie
*/
$(function(){
    $.ajax({
        url: URL + "/api/login",
        type: "GET",
        dataType: false,
        success: function(response) {
            if(response['success'] == 'success') {
                put_account_info(response.payload);
                currentUser = response.payload.username
                loginbar = document.getElementById("loginbar")
                loginbar.style.display = "none"
                account = document.getElementById("myacc")
                account.innerHTML = "My Account"
                account.href="#userprofile"
                // hide register button
                document.getElementById("registerButton").style.display = "none";
                //show log out button
                document.getElementById("logoutb").style.display = "block";
            }
        }
    });
});


/*
	Login
*/
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
                    if (window.location.hash != 'forum') { 
                        window.location.href = URL; 
                    }
                    console.log("success")
                    put_account_info(response.payload);
                    currentUser = username
                    loginbar = document.getElementById("loginbar")
                    loginbar.style.display = "none"
                    account = document.getElementById("myacc")
                    account.innerHTML = "My Account"
                    account.href="#userprofile"              
                    // hide register button
                    document.getElementById("registerButton").style.display = "none";              
                    //show log out button
                    document.getElementById("logoutb").style.display = "block";
                
                }
            }
        });
    });
}
/*
	Logout
*/
function logout(evt) {
    $(function(){
        $.ajax({
            url: URL + "/api/logout",
            type: "POST",
            data: {},
            dataType: "json",
            success: function(response) {
                location.reload();         
            }
        });
    });
}


/*
	Helper function to load current user setting
*/
function put_account_info(user_info) {
    $('#editFName').val(user_info.firstName);
    $('#editLName').val(user_info.lastName);
    $('#editAddress').val(user_info.address);
    $('#editEmail').val(user_info.email);
    $('#userPhoto').attr("src", user_info.photo);
    $('#myaccUsername').text("Username: "+user_info.username);
}


/*
	Register an account
*/
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
    
    if (firstName == null) {
        firstName = "";
    }
    if (lastName == null) {
        lastName = "";
    }
    if (address == null) {
        address = "";
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
                    if (window.location.hash != '/#loginbar') { 
                        window.location.href = URL + '/#loginbar'; 
                    } 
                  }       
              }
            });
        });
    }
}

/*
	Edit user profile
*/
function editProfile() {
    var firstName = document.getElementById("editFName").value;
    var lastName = document.getElementById("editLName").value;
    var address = document.getElementById("editAddress").value;
    var email = document.getElementById("editEmail").value;
    var oPw = document.getElementById("Opassword").value;
    var nPw = document.getElementById("newPassword").value;
    var correct = 1;
    if (firstName == null) {
        firstName = "";
    }
    if (lastName == null) {
        lastName = "";
    }
    if (address == null) {
        address = "";
    }
    if (email.length == 0 || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        alert("Invalid email address")
        correct = 0;
    }
    if (nPw.length < 5 && nPw.length > 0){
        correct = 0;
        alert("New password too short.")
    }
    if(nPw.length == 0) {
        nPw = oPw;
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
                        window.location.reload(); 
                    } else {
                        alert("Failed to change profile. Please make sure that you type the correct old password.")
                    }
                }
                });
            });
        })
    }
}
/*
	Delete account
*/
function deleteProfile() {
    var oPw = document.getElementById("Opassword").value;
    $(function(){
        $.ajax({
        url: URL + "/api/accounts",
        type: "DELETE",
        data:   {'username': currentUser,
                'old_password': oPw},
        dataType: "json",
        success: function(response) {
            if (response["success"] == "success") {
                alert("Profile deleted");
                currentUser = ""
                if (window.location.hash != '/#forum') { 
                    window.location.href = URL; 
                } 
            } else {
                alert("Failed to delete profile. Please make sure that you type the correct old password.")
            }
        }
        });
    });

}

