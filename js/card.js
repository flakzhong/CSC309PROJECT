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
            React.createElement(FirstFilterList, null),
            React.createElement(SecondFilterList, null),
            React.createElement(PostList, null)
        );
    }

    updateFirstFilter(choice) {
        this.setState({ firstfilter: choice });
    }

    updateSecondFilter(choice) {
        this.setState({ secondfilter: choice });
    }
}

class FirstFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(e) {
        this.updateFirstFilter(e.target.value);
    }

    render() {
        return React.createElement(
            "ul",
            null,
            React.createElement(FilterItem, { text: "All" }),
            React.createElement(FilterItem, { text: "Adoption" }),
            React.createElement(FilterItem, { text: "Lost" }),
            React.createElement(FilterItem, { text: "Others" })
        );
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter(e) {
        this.updateSecondFilter(e.target.value);
    }

    render() {
        return React.createElement(
            "ul",
            null,
            React.createElement(FilterItem, { text: "All" }),
            React.createElement(FilterItem, { text: "Dog" }),
            React.createElement(FilterItem, { text: "Cat" }),
            React.createElement(FilterItem, { text: "Others" })
        );
    }
}

class FilterItem extends React.Component {
    constructor(props) {
        super(props);
        this.value = props.text;
    }
    render() {
        return React.createElement(
            "li",
            null,
            React.createElement(
                "button",
                { onClick: this.updateFilter },
                this.value
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

