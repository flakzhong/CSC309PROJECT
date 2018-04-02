Our website is a forum about pets.

For the forum part, we use 2-level filter to filter the posts of the forum, in other words, users can decide what kind of posts they can see on the forum. For example, they can choose to see posts about "Adoption - Dog".

Users can only make new posts after they have logged in.

If the user is making a new post, the current filters will determine the type of the post.

A user can register an account in the forum.

Once a user logs in, the login button on the upper right corner of the website will be replaced by a log out button, and the register button will got replaced by my account button which you can click to see and manage your account information.

There is a delete account button in the account management page, which you can use to delete your account in the server database.

A user can change his/her profile in the account management page.

User need to provide passwords for every operations on the his/her account.

A user can read the detailed content of a post or reply to a post by expanding the post.

Post can also be unfolded by clicking the unfold button.

Posts will be displayed page by page, a single page can contain at most five posts.

A user can reply to a post in the forum once he/she has logged in.

To use our app, do

1. go into the folder: assignment-3-default

2. do npm install
```
npm install
```

3. run server:

```
node js/server.js
```

4. open another shell, use ngrok (there are the ngrok executables in the ngroks for linux, windows and mac)

if you are a mac user, do
```
cd ngroks/mac/
./ngrok authtoken 5Z6GXXCaSXU18Q6g2TMSt_6k6NLg5ucMPQL2XZgYsaz
./ngrok http 3000 --subdomain cscdefault01
```

if you are a linux user, do
```
cd ngroks/linux/
./ngrok authtoken 5Z6GXXCaSXU18Q6g2TMSt_6k6NLg5ucMPQL2XZgYsaz
./ngrok http 3000 --subdomain cscdefault01
```

if you are a windows user, do
```
cd ngroks/windows/
ngrok authtoken 5Z6GXXCaSXU18Q6g2TMSt_6k6NLg5ucMPQL2XZgYsaz
ngrok http 3000 --subdomain cscdefault01
```
