class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter:"All",
            secondfilter:"All",
            posts:[],
            postsperpage:10
        }
        this.updatePosts = this.updatePosts.bind(this);
        this.updateFirstFilter = this.updateFirstFilter.bind(this);
        this.updateSecondFilter = this.updateSecondFilter.bind(this);
    }

    updatePosts() {
        fetch("http://" + "?mode=page&first=" + this.state.firstfilter + "&second=" + this.state.secondfilter)
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

    render() {
        return (
            <div>
                <FirstFilterList updateFilter={this.updateFirstFilter}/>
                <SecondFilterList updateFilter={this.updateSecondFilter}/>
                <PostList posts={this.state.posts} postsperpage={this.state.postsperpage}/>
            </div>
        );
    }

    updateFirstFilter(choice) {
        this.setState({firstfilter: choice})
	console.log("firstfilter -> " + this.state.firstfilter)
	this.updatePosts();
    }

    updateSecondFilter(choice) {
        this.setState({secondfilter: choice})
	console.log("firstfilter -> " + this.state.firstfilter)
	this.updatePosts();
    }
}

function FirstFilterList(props) {
    return(
        <ul>
            <li><button onClick={props.updateFilter("All")}>All</button></li>
            <li><button onClick={props.updateFilter("Adoption")}>Adoption</button></li>
            <li><button onClick={props.updateFilter("Lost")}>Lost</button></li>
            <li><button onClick={props.updateFilter("Others")}>Others</button></li>
        </ul>
    )
}

function SecondFilterList(props) {
    return(
        <ul>
            <li><button onClick={props.updateFilter("All")}>All</button></li>
            <li><button onClick={props.updateFilter("Dogs")}>Dogs</button></li>
            <li><button onClick={props.updateFilter("Cats")}>Cats</button></li>
            <li><button onClick={props.updateFilter("Others")}>Others</button></li>
        </ul>
    )
}


class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts:this.props.posts,
            postsperpage:this.props.postsperpage,
            currpageposts:[],
            pagenum:1,
            maxpnum: Math.ceil(this.props.posts.length / this.props.postsperpage)
        }
        this.nextpage = this.nextpage.bind(this)
        this.prevpage = this.prevpage.bind(this)
    }

    updatecurrpage() {
        temp=[]
        starti = (this.state.pagenum - 1) * 10
        endi = (this.state.pagenum) * 10
        for (i = starti; i < endi || i < this.state.posts.length; i++) {
            temp.push(this.state.posts[i])
        }
        this.setState({currpageposts:temp})
    }

    nextpage(e) {
	console.log("nextpage")
	console.log("trying to set page to " + (this.state.pagenum + 1))
        if (this.state.pagenum + 1 <= this.state.maxpnum) {
            this.setState({pagenum: this.state.pagenum + 1})
        }
        this.updatecurrpage()
    }

    prevpage(e) {
	console.log("prevpage")
	console.log("trying to set page to " + (this.state.pagenum - 1))
        if (this.state.pagenum - 1 >= 1) {
            this.setState({pagenum: this.state.pagenum - 1})
        }
        this.updatecurrpage()
    }
    
    render() {
        return (
            <div>
                <ul>
                    {this.state.currpageposts.map(item => (
                        <Post post={item}></Post>
                    ))}
                </ul>
                <PageSelector max={this.state.maxpnum} curr={this.state.pagenum} next={this.nextpage} prev={this.prevpage}/>
            </div>
        )
    }
}


function Post(props) {
    return (
        <li>
            <h3> {props.post["title"]}</h3>  {props.post["auth"]}
        </li>
    )
}

class PageSelector extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <ul>
                <button onClick={this.props.prev}>Prev Page</button>
                <div>{this.props.curr}/{this.props.max}</div>
                <button onClick={this.props.next}>Next Page</button>
            </ul>
        )
    }
}

ReactDOM.render(<ForumBody />, document.getElementById('webbody'));
