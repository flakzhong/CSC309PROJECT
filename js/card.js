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
        fetch("http://a285392a.ngrok.io/page" + "?first=" + this.state.firstfilter + "&second=" + this.state.secondfilter).then(response => {
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
            null,
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
        );
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
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
            null,
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
            { className: "postEditor", id: "postEditor" },
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
                    { id: "post", style: { float: "right" }, onClick: this.makePost },
                    "Post"
                )
            )
        );
    }

    makePost() {
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
                                username: "placeholder, waiting for cookie",
                                content: content,
                                images: img_url,
                                filter1: this.props.filter1,
                                filter2: this.props.filter2
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
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
}

ReactDOM.render(React.createElement(ForumBody, null), document.getElementById("forum"));

