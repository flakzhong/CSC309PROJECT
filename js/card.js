class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter: "All",
            secondfilter: "All",
            posts: [],
            postsperpage: 10,
            pagenum: 1
        };
        this.updatePosts = this.updatePosts.bind(this);
        this.updateFirstFilter = this.updateFirstFilter.bind(this);
        this.updateSecondFilter = this.updateSecondFilter.bind(this);
    }

    updatePosts() {
        fetch("http://" + "?first=" + this.state.firstfilter + "&second=" + this.state.secondfilter).then(response => {
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
        return React.createElement(
            "div",
            null,
            React.createElement(FirstFilterList, { filterUpdate: this.updateFirstFilter }),
            React.createElement(SecondFilterList, { filterUpdate: this.updateSecondFilter }),
            React.createElement(PostList, null)
        );
    }

    updateFirstFilter(choice) {
        this.setState({ firstfilter: choice });
        console.log("firstFilterupdated");
    }

    updateSecondFilter(choice) {
        this.setState({ secondfilter: choice });
        console.log("secondFilterupdated");
    }
}

class FirstFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(e) {
        this.props.filterUpdate(e.target.text);
        console.log("updating first filter");
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
                    { onClick: this.updateFilter, text: "All" },
                    "All"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Adoption" },
                    "Adoption"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Lost" },
                    "Lost"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Others" },
                    "Others"
                )
            )
        );
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(e) {
        this.props.filterUpdate(e.target.text);
        console.log("updating second filter");
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
                    { onClick: this.updateFilter, text: "All" },
                    "All"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Dog" },
                    "Dog"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Cat" },
                    "Cat"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: this.updateFilter, text: "Others" },
                    "Others"
                )
            )
        );
    }
}

class PostList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return null;
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return null;
    }
}

ReactDOM.render(React.createElement(ForumBody, null), document.getElementById('webbody'));

