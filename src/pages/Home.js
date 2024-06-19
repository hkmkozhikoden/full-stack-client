import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem('accessToken') }
      }).then((response) => {
        if (response.data) {
          setListOfPosts(response.data.listOfPosts || []);
          setLikedPosts((response.data.likedPosts || []).map((like) => like.PostId));
          console.log(response.data.likedPosts);
        }
      }).catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
    }
  }, [navigate]);

  const likeApost = (postId) => {
    axios.post("http://localhost:3001/likes", { PostId: postId }, {
      headers: { accessToken: localStorage.getItem('accessToken') }
    })
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      }).catch(error => {
        console.error("There was an error liking the post!", error);
      });
  };

  return (
    <div>
      {listOfPosts.length > 0 ? listOfPosts.map((value, key) => (
        <div key={key} className='post'>
          <div className='title'> {value.title}</div>
          <div className='body' onClick={() => { navigate(`/post/${value.id}`) }}>{value.postsText}</div>
          <div className='footer'>
            {value.username}
            <div className='buttons'>
              <ThumbUpAltIcon
                onClick={() => { likeApost(value.id) }}
                className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
              />
              <label> {value.Likes.length} </label>
            </div>
          </div>
        </div>
      )) : (
        <p>No posts available</p>
      )}
    </div>
  );
}

export default Home;
