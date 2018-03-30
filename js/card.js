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
            React.createElement(FirstFilterList, { updateFilter: this.updateFirstFilter }),
            React.createElement(SecondFilterList, { updateFilter: this.updateSecondFilter }),
            React.createElement(PostList, { posts: this.state.posts, postsperpage: this.state.postsperpage })
        );
    }

    updateFirstFilter(choice) {
        this.setState({ firstfilter: choice });
        console.log("firstfilter -> " + this.state.firstfilter);
    }

    updateSecondFilter(choice) {
        this.setState({ secondfilter: choice });
        console.log("firstfilter -> " + this.state.firstfilter);
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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
                    { onClick: () => {
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

ReactDOM.render(React.createElement(ForumBody, null), document.getElementById('webbody'));

