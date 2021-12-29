import React, { useEffect } from 'react'
import axios from '../utils/axios'
import { axiosWithAuth } from '../utils/axiosWithAuth'
import { connect } from 'react-redux'
import { getPosts, getSubs, upVotePost, downVotePost, deletePost } from '../action/index'
import Sidebar from '../components/Sidebar'
import { checkLoggedIn } from '../utils/checkLoggedIn'
import { useHistory } from 'react-router-dom'
import Search from './Search'
import { TemporaryPosts } from '../constants/Posts';
import  '../assets/index.scss'

const styleColor = {
    color: "#007BFD",
    cursor: "pointer"
}

function MainPage(props) {
    console.log('props', props)
    const history = useHistory()

    const postLinkHandler = (post_id) => {
        history.push(`/post/${post_id}`)
    }

    const subLinkHandler = (name) => {
        history.push(`/r/${name}`)
    }

    const upVoteHandler = (post_id) => {
        if (checkLoggedIn()) {
            props.upVotePost(post_id)
            axios.put(`/api/post/upvote/${post_id}`)
                .then(res => console.log(res))
                .catch(err => console.log(err))
        }
        else
            history.push(`/login`)

    }

    const downVoteHandler = (post_id, post_likes) => {
        if (checkLoggedIn()) {
            if (post_likes <= 0)
                return
            props.downVotePost(post_id)
            axios.put(`/api/post/downvote/${post_id}`)
        }
        else
            history.push(`/login`)
    }

    const deletePostHandler = (post_id) => {
        axiosWithAuth().delete(`/api/post/${post_id}`)
            .then(res => {
                props.deletePost(post_id)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        < div className="main-container" >
            <div className="posts-container">
                {
                    TemporaryPosts.map(post => {
                        return <div className="post" style={{"marginBottom": "12px"}}>
                            <div className="like-container" style={{"width": "5%", textAlign: "center" }}>
                                <div className="upvote" onClick={() => { upVoteHandler(post.id) }}>
                                    <i class="fa fa-caret-up" style={{fontSize: "40px"}}/>
                                </div>

                                {post.likes}
                                <div className="downvote" onClick={() => { downVoteHandler(post.id, post.likes) }}>
                                <i class="fa fa-caret-down" style={{fontSize: "40px"}}/>
                                </div>
                            </div>

                            <div>
                                <div onClick={() => postLinkHandler(post.id)} style={{ color: "#0000FF", cursor: "pointer", fontSize: "30px" }} >{post.title}</div>
                                <div className="post-info" style={{fontSize: "18px"}}>
                                    Posted By:
                                <span style={{fontSize: "24px"}}>{post.username}</span> on subreadit: <span onClick={() => subLinkHandler(post.subreadit)} style={styleColor} style={{fontSize: "18px"}}>/r/{post.subreadit}</span>
                                </div>
                                <div className="post-info">Likes: {post.likes}
                                    {localStorage.user_id == post.user_id ?
                                        <span onClick={() => deletePostHandler(post.id)} style={{ color: "#007BFD", cursor: "pointer" }}>
                                            &nbsp;&nbsp;delete
                                              </span> : null
                                    }
                                </div>
                            </div>
                            <div className='post-content-container'>
                                {!post.video ?
                                    <img className='post-content' src={post.content} />
                                    :
                                    ""
                                }
                                {post.video ?
                                    <div className='post-video'>
                                        <iframe width="420" height="315" src={post.video} frameborder="0" allowfullscreen></iframe>
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </div>
                    })
                }
            </div >
            <div className="side">
                <Search />
                <Sidebar />
            </div>
        </div >
    )
}

function mapStateToProps(state) {
    return {
        posts: state.posts,
        subreadits: state.subreadits,
        userId: state.userId
    }
}

export default connect(mapStateToProps, { getPosts, getSubs, upVotePost, downVotePost, deletePost })(MainPage)
