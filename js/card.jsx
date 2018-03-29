class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter = "All",
            secondfilter = "All",
            posts = [],
            postsperpage = 10,
            pagenum = 1
        }
        this.updatePosts = this.updatePosts.bind(this);
    }

    updatePosts() {
        fetch("http://" + "?first=" + this.state.firstfilter + "&second=" + this.state.secondfilter)
        .then(response => {
            console.log(response.status, response.statusCode)
            if (response.ok) {
                return response.json()
            } else {
                throw "Nothing"
            }
        })
        .then(json => {
            this.setState({posts:json.posts});
            this.setState({pagenum: 1})
        })
        .catch(error => console.log(error))
    }

    componentDidMount() {
        // this.updatePosts()
    }

    render() {
        return (
            <div>
                <FirstFilterList/>
                <SecondFilterList/>
                <PostList/>
            </div>
        );
    }

    updateFirstFilter(choice) {
        this.setState({firstfilter: choice})
    }

    updateSecondFilter(choice) {
        this.setState({secondfilter: choice})
    }
}


class FirstFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this)
    }

    updateFilter(e) {
        this.updateFirstFilter(e.target.value)
    }

    render() {
        return (
            <ul>
                <FilterItem text="All"/>
                <FilterItem text="Adoption"/>
                <FilterItem text="Lost"/>
                <FilterItem text="Others"/>
            </ul>
        )
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this)
    }

    updateFilter(e) {
        this.updateSecondFilter(e.target.value)
    }

    render() {
        return (
            <ul>
                <FilterItem text="All"/>
                <FilterItem text="Dog"/>
                <FilterItem text="Cat"/>
                <FilterItem text="Others"/>
            </ul>
        )
    }
}

class FilterItem extends React.Component {
    constructor(props) {
        super(props);
        this.value = props.text
    }
    render() {
        return (
            <li><button onclick={this.updateFilter}>{this.value}</button></li>
        )
    }
}

class PostList extends React.Component {
    constructor(props) {
        super(props);

    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
    }
}

ReactDOM.render(<ForumBody />, document.getElementById('webbody'));