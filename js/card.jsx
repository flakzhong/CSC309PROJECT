URL = "https://52c637e2.ngrok.io"

var dateparser = function(date) {
    date = date.split(" ")
    return (date[1] + " - " + date[2])
}

class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter:"All",
            secondfilter:"All",
            posts:[],
        }
        this.updatePosts = this.updatePosts.bind(this);
        this.updateFirstFilter = this.updateFirstFilter.bind(this);
        this.updateSecondFilter = this.updateSecondFilter.bind(this);
    }


    updatePosts(filter1, filter2) {
        var ajaxURL = URL + "/api/page" + "?first=" + filter1 + "&second=" + filter2;
        fetch(ajaxURL).then(response => {
            if(response.ok) {
                return response.json();
            }
        }).then(json => {
            this.setState({posts: json.posts})
        })
    }

    componentWillMount() {
        this.updatePosts("All","All")
    }

    render() {
        return (
            <div className="block">
                <div className="forumtab">
                    <FirstFilterList updateFilter={this.updateFirstFilter}/>
                    <hr/>
                    <SecondFilterList updateFilter={this.updateSecondFilter}/>
                </div>
                <PostList postlist={this.state.posts} filter1={this.state.firstfilter} filter2={this.state.secondfilter}/>
                <hr/>
                <PostEditor filter1={this.state.firstfilter} filter2={this.state.secondfilter} forceupdater={() => (this.updatePosts(this.state.filter1, this.state.filter2))}/>
            </div>
        );
    }

    updateFirstFilter(choice) {
        var currfilter = document.getElementById("upper" + this.state.firstfilter + "Filter")
        currfilter.className = currfilter.className.replace(" active","")
        var targetfilter = document.getElementById("upper" + choice + "Filter")
        targetfilter.className += " active"
        this.setState({firstfilter: choice})
        this.updatePosts(choice, this.state.secondfilter)
    }

    updateSecondFilter(choice) {
        var currfilter = document.getElementById("lower" + this.state.secondfilter + "Filter")
        currfilter.className = currfilter.className.replace(" active","")
        var targetfilter = document.getElementById("lower" + choice + "Filter")
        targetfilter.className += " active"
        this.setState({secondfilter: choice})
        this.updatePosts(this.state.firstfilter, choice)
    }
}

class FirstFilterList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
            <div className="block">
                <ul>
                    <li><button id="upperAllFilter" className=" active" onClick={() => {this.props.updateFilter("All")}}>All</button></li>
                    <li><button id="upperStoriesFilter" onClick={() => {this.props.updateFilter("Stories")}}>Stories</button></li>
                    <li><button id="upperAdoptionFilter" onClick={() => {this.props.updateFilter("Adoption")}}>Adoption</button></li>
                    <li><button id="upperLostFilter" onClick={() => {this.props.updateFilter("Lost")}}>Lost</button></li>
                </ul>
            </div>
		)
	}
}

class SecondFilterList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
            <div className="block">
                <ul>
                    <li><button id="lowerAllFilter" className=" active" onClick={() => {this.props.updateFilter("All")}}>All</button></li>
                    <li><button id="lowerDogFilter" onClick={() => {this.props.updateFilter("Dog")}}>Dog</button></li>
                    <li><button id="lowerCatFilter" onClick={() => {this.props.updateFilter("Cat")}}>Cat</button></li>
                    <li><button id="lowerOthersFilter" onClick={() => {this.props.updateFilter("Others")}}>Others</button></li>
                </ul>
            </div>
		)
	}
}


class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currpageposts:[],
            pagenum:1,
            filter1:"",
            filter2:""
        }
        this.nextpage = this.nextpage.bind(this)
        this.prevpage = this.prevpage.bind(this)
        this.updatecurrpage = this.updatecurrpage.bind(this)
    }

    componentWillUpdate() {
        if (this.props.filter1 != this.state.filter1 || this.props.filter2 != this.state.filter2) {
            this.updatecurrpage(1)
            this.setState({pagenum:1})
            this.setState({filter1:this.props.filter1})
            this.setState({filter2:this.props.filter2})
        }
    }

    updatecurrpage(pagenum) {
        var temp=[]
        var starti = (pagenum - 1) * 10
        var endi = (pagenum) * 10
        for (var i = starti; i < endi && i < this.props.postlist.length; i++) {
            temp.push(this.props.postlist[i])
        }
        this.setState({currpageposts:temp})
    }

    nextpage(e) {
        var maxpagenum = Math.ceil(this.props.postlist.length / 10)
        if (this.state.pagenum + 1 <= maxpagenum) {
            this.updatecurrpage(this.state.pagenum + 1)
            this.setState({pagenum: this.state.pagenum + 1})
        }
        
    }

    prevpage(e) {
        if (this.state.pagenum - 1 >= 1) {
            this.updatecurrpage(this.state.pagenum - 1)
            this.setState({pagenum: this.state.pagenum - 1})
        }
    }
    
    render() {
        var maxpagenum = Math.max(Math.ceil(this.props.postlist.length / 10), 1)
        return (
            <div className="block">
                <PostPage post={this.state.currpageposts}/>
                <PageSelector max={maxpagenum} curr={this.state.pagenum} next={this.nextpage} prev={this.prevpage}/>
            </div>
        )
    }
}

class PostPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ul>
                {this.props.post.map(item => (
                    <Post post={item}></Post>
                ))}
            </ul>
        )
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            folded:true,
            replies:[],
            photo:""
        }
        this.flipPostState = this.flipPostState.bind(this)
        this.updateReplies = this.updateReplies.bind(this)
    }

    componentWillMount() {
        this.updateReplies()
        this.getphoto()
    }

    getphoto(){
        var ajaxURL = URL + "/api/photo?username=" + this.props.post.username;
        fetch(ajaxURL).then(response => {
            if(response.ok) {
                return response.json();
            }
        }).then(json => {
            this.setState({photo: json.photo})
        })
    }

    flipPostState(e) {
        this.setState({folded:!this.state.folded})
    }

    updateReplies() {
        var ajaxURL = URL + "/api/reply?postId=" + this.props.post.postId;
        fetch(ajaxURL).then(response => {
            if(response.ok) {
                return response.json();
            }
        }).then(json => {
            this.setState({replies: json.reply})
        })
    }


    render() {
        if (this.state.folded) {
            return (
                <div className="postfolded">
                    <div className="posttitle">
                        <h3>{this.props.post.title}</h3>
                    </div>
                    <div className="postauthor" style={{textAlign:"right", paddingRight:30, color:"#93969b"}}>
                        <i>by {this.props.post.username + "   " + dateparser(this.props.post.currentTime)}</i>
                    </div>
                        <img className="postUnfoldButton" onClick={this.flipPostState} src="https://res.cloudinary.com/dfpktpjp8/image/upload/v1522608454/down.png" width="20px"/>
                    <hr/>
                </div>
            )
        } else {
            return (
                <div className="postunfolded">
                    <div className="posttitle">
                        <h3>{this.props.post.title}</h3>
                    </div>
                    <br/>
                    <div className="postcontent">
                        {this.props.post.content}
                    </div>
                    <br/>
                    <PostImageViewer images={this.props.post.images}/>
                    <br/>                    
                    <div className="postauthor" style={{textAlign:"right", paddingRight:30, color:"#93969b"}}>
                        <img src={this.state.photo} width="50px" height="50px"/>
                        <br/>
                        <i>by {this.props.post.username}</i>
                        <br/>
                        <i>on {dateparser(this.props.post.currentTime)}</i>
                    </div>
                    <br/>
                    <PostReplies replies={this.state.replies}/>
                    <br/>
                    <Reply postId={this.props.post.postId} forceupdater={this.updateReplies}/>
                    <br/>
                    <img className="postFoldButton" onClick={this.flipPostState} src="https://res.cloudinary.com/dfpktpjp8/image/upload/v1522608454/up.png" width="20px"/>
                    <hr/>
                </div>
            )
        }
    }
}

class PostReplies extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (this.props.replies == null) {
            return null
        } else {
            return (
                <ul>
                    {this.props.replies.map(reply => (
                        <PostReply content={reply}/>
                    ))}
                </ul>
            )
        }
    }
}

function PostReply(props) {
    return (
        <li>
            <div className="postreply" style={{textAlign:"left", paddingLeft:"60px"}}>
                <div style={{borderLeft:"2px  solid #93969b", paddingLeft:"3px"}}>
                    {props.content.content}
                </div>
                <div style={{color:"#93969b", display:"inline", paddingLeft:"60px"}}>
                    <i>-----{props.content.username}</i>
                </div> 
            </div>
        </li>
    )   
}

class Reply extends React.Component {
    constructor(props) {
        super(props)
        this.submitReply = this.submitReply.bind(this)
    }

    submitReply() {
        var content = document.getElementById("postReply" + this.props.postId).value
        var correct = 1;
        var id = this.props.postId
        var pRId = "#postReply" + this.props.postId;
        var updater = this.props.forceupdater
        if (content.length < 5) {
            correct = 0;
            alert("Reply too short");
        }
        if (correct == 1) {
            $(function(){
                $.ajax({
                url: URL + "/api/reply",
                type: "POST",
                data:   {'username': currentUser,
                        'postId' : id,
                        'content' : content},
                dataType: "json",
                success: function(response) {
                    if (response["success"] == "success") {
                        $(pRId).val("");
                        updater()
                    } else {
                        alert("Failed to reply. Please try again")
                    }
                }
                });
            });
        }
    }

    render(){
        if (currentUser == "") {
            return null
        } else {
            return (
                <div>
                    <input type="text" id={"postReply" + this.props.postId}/>
                    <button onClick={this.submitReply}>Reply</button>
                </div>
            )  
        } 
    }
}

class PostImageViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.images != "") {
            return (
                <ul>
                    {this.props.images.map(item => (
                        <SingleImage url={item}></SingleImage>
                    ))}
                </ul>
            )
        } else {
            return null
        }        
    }
}

function SingleImage(props) {
    return (
        <li>
            <img src={props.url} width="300px" />
        </li>
    )
}


class PageSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.curr == 1 && this.props.max != 1) {
            return(
                <div className="block">
                    <ul>
                        <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522617226/empty.png" width="30px"/>
                        <div style={{display:"inline", padding:"5px", fontSize:"30px"}}>{this.props.curr}/{this.props.max}</div>
                        <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522616501/right.png" width="30px" onClick={this.props.next}/>
                    </ul>
                </div>
            )
        } else if (this.props.curr == 1 && this.props.max == 1) {
            return(
                <div className="block">
                    <ul>
                        <div style={{display:"inline", padding:"5px", fontSize:"30px"}}>{this.props.curr}/{this.props.max}</div>
                    </ul>
                </div>
            )
        } else if (this.props.curr == this.props.max) {
            return(
                <div className="block">
                    <ul>
                        <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522616501/left.png" width="30px" onClick={this.props.prev}/>
                        <div style={{display:"inline", padding:"5px", fontSize:"30px"}}>{this.props.curr}/{this.props.max}</div>
                        <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522617226/empty.png" width="30px"/>
                    </ul>
                </div>
            )
        } 
        return(
            <div className="block">
                <ul>
                    <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522616501/left.png" width="30px" onClick={this.props.prev}/>
                    <div style={{display:"inline", padding:"5px", fontSize:"30px"}}>{this.props.curr}/{this.props.max}</div>
                    <img style={{display:"inline"}} src="http://res.cloudinary.com/dfpktpjp8/image/upload/v1522616501/right.png" width="30px" onClick={this.props.next}/>
                </ul>
            </div>
        )
    }
}


class PostEditor extends React.Component {
    constructor(props) {
        super(props)
        this.makePost=this.makePost.bind(this)
    }

    render() {
        if (currentUser == "" || this.props.filter1 == "All" || this.props.filter2 == "All") {
            return null
        } else {
            return (
                <div className="postEditor block" id="postEditor" style={{padding:"10px"}}>
                    <h1>Title:</h1>
                    <section className="makePosts">
                        <div className="stretch">
                            <input type="text" id="postTitle"/>
                        </div>
                    </section>
                    <h1>Content: </h1>
                    <section className="makePosts">
                        <textarea className="stretch" rows="20" id="postContent"></textarea>						
                    </section>
                    <div>
                        <label htmlFor="postImgUpload" style={{float:"left"}}>Insert IMG</label>
                        <input type="file" id="postImgUpload" style={{float:"left"}} accept=".jpg, .jpeg, .png" multiple/>
                        <button id="post" style={{width:"100%"}} onClick={() => {this.makePost(this.props.filter1, this.props.filter2)}}>Post</button>
                    </div>
                </div>
            )
        }
    }

    makePost(filter1, filter2) {
        var submitButton = document.getElementById('post');
        var title = document.getElementById("postTitle").value;
        var content = document.getElementById("postContent").value;
        var correct = 1;
        var updater = this.props.forceupdater
        if (title.length < 5) {
            correct = 0;
            alert("Title too short.");
        }
    
        if (content.length < 5) {
            correct = 0;
            alert("Content too short.")
        }
        if (correct == 1) {
            var images = document.getElementById("postImgUpload").files;
            if (images.length > 0) {
                var img_url = [];
                for(var i = 0; i < images.length; i++) {
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
                    }).then(function(res) {
                        img_url.push(res['data']['secure_url']);
                            if (img_url.length == images.length) {
                                $(function(){
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
                                        success: function(response) {
                                            if (response['success'] != 'success') {
                                                alert("failed to post");
                                            } else {
                                                $("#postTitle").val("");
                                                $("#postContent").val("");
                                                $("#postImgUpload").val(null);
                                                alert("posted");
                                                updater(filter1, filter2)
                                            }       
                                        }
                                    });
                                });
                            }
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
            } else {
                $(function(){
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
                        success: function(response) {
                            if (response['success'] != 'success') {
                            alert("failed to post");
                            } else {
                            alert("posted")
                            updater();
                            }       
                        }
                    });
                });
            }
        }
    }
}


ReactDOM.render(<ForumBody />, document.getElementById("forum"));