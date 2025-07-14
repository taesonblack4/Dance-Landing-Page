import React, { useState,useEffect } from 'react';
import axios from 'axios';

const HOST = 'http://localhost:4004/basic/posts/announcements'

const Announcements = () => {
  const [posts,setposts] = useState([]);
  const fetchPosts = async () => {
    try {
      const response  = await axios.get(HOST);
      setposts(response.data.data);
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);



  return (
    <div>
      <h1>news</h1>
      {/* Feed */}
      <div className='feed-container'>
        <div className='post-container'>
          {posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <h3>{post.type}</h3>
              <h4>{post.content}</h4>

              <p>
                Created: {new Date(post.created_at).toLocaleString()}
              </p>

              {post.updated_at && (
                <p>
                  Last Updated: {new Date(post.updated_at).toLocaleString()}
                </p>
              )}    
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Announcements
