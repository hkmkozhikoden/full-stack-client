import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import {useNavigate, useParams,} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';

function Post() {
    let {id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);

    let navigate= useNavigate();

    useEffect (() =>{
        axios.get(`http://localhost:3001/posts/byId/${id}`).then ((response) => {
            setPostObject(response.data)
          });

          axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data)
          });
    }, []);
    const addComment = () => {
      axios.post("http://localhost:3001/comments", 
      {commentBody:newComment, PostId:id},
      {
        headers:{
          accessToken: localStorage.getItem("accessToken")
        }
      },
      )
      .then((response)=>{
        if (response.data.error) {
        console.log(response.data.error);
      }else
        {
        const commentToAdd = {commentBody: newComment, username: response.data.username}
        setComments([...comments, commentToAdd ]);
        setNewComment("");
        }
      })
    }

    const deleteComment = (id) =>{
      axios.delete(`http://localhost:3001/comments/${id}`, {headers: {accessToken: localStorage.getItem('accessToken')}
    }).then(() =>{
      setComments (
        comments.filter((val)=> {
        return val.id != id;
      }))
      })
  }

  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`,
    {headers: {accessToken: localStorage.getItem('accessToken')}
  }).then(() =>{
     navigate("/")
    })
  }

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter your title");
      axios.put(
        "http://localhost:3001/posts/title", 
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then(() => {
        setPostObject({ ...postObject, title: newTitle });
      });
    } else {
      let newPostText = prompt("Enter your PostText");
      axios.put(
        "http://localhost:3001/posts/postText", 
        { newPostText: newPostText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then(() => {
        setPostObject({ ...postObject, postText: newPostText });
      });
    }
  };
  return (  
    <div className='postPage'>
        <div className='leftSide'>
            <div className='post' id='individual'>
            <div className='title'
             onClick={() => {
              if (authState.username === postObject.username){
              editPost("title");
            }}
             }
              >
                {postObject.title}
            </div>
            <div className='body' onClick={() => {
              if (authState.username === postObject.username) {
              editPost("body");
                }
                }}>
             {postObject.postsText}
              </div>
            <div className='footer'>
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                {" "}
                Delete Post
              </button>
            )}
            </div>
           
            </div>
        </div>
        <div className="rightSide">
          <div className='addCommentContainer'>
            <input type='text' placeholder='comment'  value={newComment} autoComplete='off' onChange={(event) =>{setNewComment(event.target.value)}}/>
            <button onClick={addComment}>Add Comments</button>
          </div>
          <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <lable> username: {comment.username}</lable>
                {authState.username === comment.username &&
                 <button onClick={() =>deleteComment(comment.id)}>Delete</button>}
              </div>
            );
          })}
        </div>
        </div>
    </div>
  )
}

export default Post
