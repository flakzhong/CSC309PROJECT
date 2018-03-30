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
        this.newPostSubmit = this.newPostSubmit.bind(this);
    }

    updatePosts() {
        fetch("http://a285392a.ngrok.io/page" + "?first=" + this.state.firstfilter + "&second=" + this.state.secondfilter)
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
	this.updatePosts();
        return (
            <div>
                <FirstFilterList updateFilter={this.updateFirstFilter}/>
                <SecondFilterList updateFilter={this.updateSecondFilter}/>
                <PostList posts={this.state.posts} postsperpage={this.state.postsperpage}/>
                <PostEditor post={this.newPostSubmit}/>
            </div>
        );
    }

    updateFirstFilter(choice) {
        this.setState({firstfilter: choice})
	console.log("firstfilter -> " + this.state.firstfilter)
    }

    updateSecondFilter(choice) {
        this.setState({secondfilter: choice})
	console.log("firstfilter -> " + this.state.firstfilter)
    }
    
    newPostSubmit(object) {
        //TODO: this is used to submit the object to the given domain
    }
}

class FirstFilterList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<ul>
			    <li><button onClick={() => {this.props.updateFilter("All")}}>All</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Adoption")}}>Adoption</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Lost")}}>Lost</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Others")}}>Others</button></li>
			</ul>
		)
	}
}

class SecondFilterList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<ul>
			    <li><button onClick={() => {this.props.updateFilter("All")}}>All</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Dog")}}>Dog</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Cat")}}>Cat</button></li>
			    <li><button onClick={() => {this.props.updateFilter("Others")}}>Others</button></li>
			</ul>
		)
	}
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

class PostEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title:"",
            content:"",
            images:[]
        }
        this.addImageToPost = this.addImageToPost.bind(this)
    }

    generateNewPost() {
        //TODO: use this.props.post(object) to post the post onto the given url
        
    }

    addImageToPost(img) {
        this.setState({images: this.state.images.concat(img)})
    }

    render() {
        return (
            <div>
                <h1>Title:</h1>
                <section class="makePosts">
                        <div class="stretch">
                            <input type="text" id="postTitle"/>
                        </div>
                </section>
                    
                <h1>Content: </h1>
                <section class="makePosts">
                        <textarea class="stretch" rows="20" id="postContent"></textarea>						
                </section>
                <ImagePicker addImg={this.addImageToPost}/>
                <button onClick={this.props.submit}>Post!</button>
            </div>
        )
    }
}

class ImagePicker extends React.Component {
    //TODO: this should be the implementation of Image picker and uploader
    //TODO use this.props.addImg(img) to add an image to the editing post
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <label for="postImgUpload" style="float:left">Insert IMG</label>
                <form id="post" method="post" enctype="multipart/form-data" action="/uploads">
                    <input type="file" name="filetoupload" style="float:left" accept=".jpg, .jpeg, .png" multiple></input>
                    <input type="submit" style="float:right"></input>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<ForumBody />, document.getElementById('webbody'));
