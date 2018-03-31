class Webbody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: "",
            currpage: "forum"
        };
        this.updateSession = this.updateSession.bind(this);
    }

    render() {
        return React.createElement(LoginBar, { style: { "background-color": "#f1c01c" }, updateSession: this.updateSession, lgin: this.state.login, usrn: this.state.username });
    }

    updateSession(login, username) {
        this.setState({ login: login });
        this.setState({ username: username });
    }
}

class LoginBar extends React.Component {
    constructor(props) {
        super(props);
        this.put_account_info = this.put_account_info.bind(this);
        this.login = this.login.bind(this);
    }

    render() {
        if (this.props.lgin) {
            return React.createElement(
                "div",
                null,
                "Welcome, ",
                this.props.usrn,
                "!"
            );
        } else {
            return React.createElement(
                "div",
                { className: "loginbar", id: "loginbar" },
                "User name: ",
                React.createElement("input", { type: "text", id: "userid", placeholder: "User name" }),
                "Password: ",
                React.createElement("input", { type: "password", id: "userpass", placeholder: "Password" }),
                React.createElement(
                    "button",
                    { id: "loginbutton", onClick: this.login },
                    "Submit"
                )
            );
        }
    }

    put_account_info(user_info) {
        $('div.info-group#myaccFName').text("First name: " + user_info.firstName);
        $('div.info-group#myaccLName').text("Last name: " + user_info.lastName);
        $('div.info-group#myaccAddress').text("Address: " + user_info.address);
        $('div.info-group#myaccEmail').text("Email: " + user_info.email);
        $('div.info-group#myaccUsername').text("Username: " + user_info.username);
    }

    login() {
        var username = document.getElementById("userid").value;
        var password = document.getElementById("userpass").value;
        var success = 0;
        console.log("trying to login");
        $(function () {
            $.ajax({
                url: "https://7d46c159.ngrok.io/api/login",
                type: "POST",
                data: { 'username': username,
                    'password': password },
                dataType: "json",
                success: function (response) {
                    console.log("succeed");
                    if (response['success'] == 'failed') {
                        alert("Failed to login. Please check your username and password.");
                    } else {
                        put_account_info(response.payload);
                        this.props.updateSession(true, username);
                    }
                }
            });
        });
    }
}

class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter: "All",
            secondfilter: "All",
            posts: [],
            postsperpage: 10
        };
        this.updatePosts = this.updatePosts.bind(this);
        this.updateFirstFilter = this.updateFirstFilter.bind(this);
        this.updateSecondFilter = this.updateSecondFilter.bind(this);
    }

    updatePosts() {
        fetch("https://7d46c159.ngrok.io/api/page" + "?first=" + this.state.firstfilter + "&second=" + this.state.secondfilter).then(response => {
            console.log(response.status, response.statusCode);
            if (response.ok) {
                return response.json();
            } else {
                throw "Nothing";
            }
        }).then(json => {
            this.setState({ posts: json.posts });
            this.setState({ pagenum: 1 });
        }).catch(error => console.log(error));
    }

    render() {
        this.updatePosts();
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "div",
                { className: "forumtab" },
                React.createElement(FirstFilterList, { updateFilter: this.updateFirstFilter }),
                React.createElement(SecondFilterList, { updateFilter: this.updateSecondFilter })
            ),
            React.createElement(PostList, { posts: this.state.posts, postsperpage: this.state.postsperpage }),
            React.createElement(PostEditor, { filter1: this.state.firstfilter, filter2: this.state.secondfilter })
        );
    }

    updateFirstFilter(choice) {
        var currfilter = document.getElementById("upper" + this.state.firstfilter + "Filter");
        currfilter.className = currfilter.className.replace(" active", "");
        var targetfilter = document.getElementById("upper" + choice + "Filter");
        targetfilter.className += " active";
        this.setState({ firstfilter: choice });
    }

    updateSecondFilter(choice) {
        var currfilter = document.getElementById("lower" + this.state.secondfilter + "Filter");
        currfilter.className = currfilter.className.replace(" active", "");
        var targetfilter = document.getElementById("lower" + choice + "Filter");
        targetfilter.className += " active";
        this.setState({ secondfilter: choice });
    }
}

class FirstFilterList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperAllFilter", className: " active", onClick: () => {
                                this.props.updateFilter("All");
                            } },
                        "All"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperAdoptionFilter", onClick: () => {
                                this.props.updateFilter("Adoption");
                            } },
                        "Adoption"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperLostFilter", onClick: () => {
                                this.props.updateFilter("Lost");
                            } },
                        "Lost"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperOthersFilter", onClick: () => {
                                this.props.updateFilter("Others");
                            } },
                        "Others"
                    )
                )
            )
        );
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerAllFilter", className: " active", onClick: () => {
                                this.props.updateFilter("All");
                            } },
                        "All"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerDogFilter", onClick: () => {
                                this.props.updateFilter("Dog");
                            } },
                        "Dog"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerCatFilter", onClick: () => {
                                this.props.updateFilter("Cat");
                            } },
                        "Cat"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerOthersFilter", onClick: () => {
                                this.props.updateFilter("Others");
                            } },
                        "Others"
                    )
                )
            )
        );
    }
}

class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
            postsperpage: this.props.postsperpage,
            currpageposts: [],
            pagenum: 1,
            maxpnum: Math.ceil(this.props.posts.length / this.props.postsperpage)
        };
        this.nextpage = this.nextpage.bind(this);
        this.prevpage = this.prevpage.bind(this);
    }

    updatecurrpage() {
        temp = [];
        starti = (this.state.pagenum - 1) * 10;
        endi = this.state.pagenum * 10;
        for (i = starti; i < endi || i < this.state.posts.length; i++) {
            temp.push(this.state.posts[i]);
        }
        this.setState({ currpageposts: temp });
    }

    nextpage(e) {
        console.log("nextpage");
        console.log("trying to set page to " + (this.state.pagenum + 1));
        if (this.state.pagenum + 1 <= this.state.maxpnum) {
            this.setState({ pagenum: this.state.pagenum + 1 });
        }
        this.updatecurrpage();
    }

    prevpage(e) {
        console.log("prevpage");
        console.log("trying to set page to " + (this.state.pagenum - 1));
        if (this.state.pagenum - 1 >= 1) {
            this.setState({ pagenum: this.state.pagenum - 1 });
        }
        this.updatecurrpage();
    }

    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                this.state.currpageposts.map(item => React.createElement(Post, { post: item }))
            ),
            React.createElement(PageSelector, { max: this.state.maxpnum, curr: this.state.pagenum, next: this.nextpage, prev: this.prevpage })
        );
    }
}

function Post(props) {
    return React.createElement(
        "li",
        null,
        React.createElement(
            "h3",
            null,
            " ",
            props.post["title"]
        ),
        "  ",
        props.post["auth"]
    );
}

class PageSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "button",
                    { onClick: this.props.prev },
                    "Prev Page"
                ),
                React.createElement(
                    "div",
                    null,
                    this.props.curr,
                    "/",
                    this.props.max
                ),
                React.createElement(
                    "button",
                    { onClick: this.props.next },
                    "Next Page"
                )
            )
        );
    }
}

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.makePost = this.makePost.bind(this);
    }

    render() {
        return React.createElement(
            "div",
            { className: "postEditor block", id: "postEditor" },
            React.createElement(
                "h1",
                null,
                "Title:"
            ),
            React.createElement(
                "section",
                { className: "makePosts" },
                React.createElement(
                    "div",
                    { className: "stretch" },
                    React.createElement("input", { type: "text", id: "postTitle" })
                )
            ),
            React.createElement(
                "h1",
                null,
                "Content: "
            ),
            React.createElement(
                "section",
                { className: "makePosts" },
                React.createElement("textarea", { className: "stretch", rows: "20", id: "postContent" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "postImgUpload", style: { float: "left" } },
                    "Insert IMG"
                ),
                React.createElement("input", { type: "file", id: "postImgUpload", style: { float: "left" }, accept: ".jpg, .jpeg, .png", multiple: true }),
                React.createElement(
                    "button",
                    { id: "post", style: { float: "right" }, onClick: () => {
                            this.makePost(this.props.filter1, this.props.filter2);
                        } },
                    "Post"
                )
            )
        );
    }

    makePost(filter1, filter2) {
        var submitButton = document.getElementById('post');
        var title = document.getElementById("postTitle").value;
        var content = document.getElementById("postContent").value;
        if (title.length < 5) {
            alert("Title too short.");
        }

        if (content.length < 5) {
            alert("Content too short.");
        }
        var images = document.getElementById("postImgUpload").files;
        if (images.length > 0) {
            var img_url = [];
            for (var i = 0; i < images.length; i++) {
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
                }).then(function (res) {
                    img_url.push(res['data']['secure_url']);
                    if (img_url.length == images.length) {
                        $(function () {
                            $.ajax({
                                url: URL + "/api/posts",
                                type: "POST",
                                data: {
                                    title: title,
                                    username: currentUser,
                                    content: content,
                                    images: img_url,
                                    filter1: filter1,
                                    filter2: filter2
                                },
                                dataType: "json",
                                success: function (response) {
                                    if (response['success'] != 'success') {
                                        alert("failed to post");
                                    } else {
                                        $("#postTitle").val("");
                                        $("#postContent").val("");
                                        $("#postImgUpload").val(null);
                                        alert("posted");
                                    }
                                }
                            });
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        } else {
            $(function () {
                $.ajax({
                    url: URL + "/api/posts",
                    type: "POST",
                    data: {
                        title: title,
                        username: currentUser,
                        content: content,
                        images: null,
                        filter1: filter1,
                        filter2: filter2
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response['success'] != 'success') {
                            alert("failed to post");
                        } else {
                            alert("posted");
                        }
                    }
                });
            });
        }
    }
}

ReactDOM.render(React.createElement(ForumBody, null), document.getElementById("forum"));

