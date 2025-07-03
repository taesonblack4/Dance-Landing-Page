import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = 'http://localhost:4004/admin/posts';

export default function Posts() {
  // Form visibility state
  const [showForm, setShowForm] = useState(false);

  // Posts state and fetch
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const response = await axios.get(HOST);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Form fields state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState([]);
  const [audience, setAudience] = useState([]);

  const handleCheckboxChange = (e, setter, arr) => {
    const { value, checked } = e.target;
    setter(checked ? [...arr, value] : arr.filter(i => i !== value));
  };

  const addPost = async () => {
    if (!title || !type || !content) {
      alert('Please fill out title, type, and content');
      return;
    }
    try {
      await axios.post(HOST, { title, type, content, category, audience });
      alert('Post added');
      setTitle(''); setType(''); setContent('');
      setCategory([]); setAudience([]);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err);
      alert('Failed to add post');
    }
  };

  return (
    <div>
      <h1>Announcements & Promos</h1>

      {/* Toggle form visibility */}
      {showForm ? (
        <button onClick={() => setShowForm(false)}>Cancel</button>
      ) : (
        <button onClick={() => setShowForm(true)}>Create Post</button>
      )}

      {/* Conditionally render the form */}
      {showForm && (
        <div className='form-container'>
          <form onSubmit={e => { e.preventDefault(); addPost(); }}>
            <div>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div>
              <label>Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} required />
            </div>

            <div>
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} required>
                <option value='' disabled>Select…</option>
                <option value='Announcement'>Announcement</option>
                <option value='Promotion'>Promotion</option>
              </select>
            </div>

            <div>
              <label>Category</label>
              {['teaching','coaching','performing'].map(opt => (
                <label key={opt}>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={category.includes(opt)}
                    onChange={e => handleCheckboxChange(e, setCategory, category)}
                  />{opt}
                </label>
              ))}
            </div>

            <div>
              <label>Audience</label>
              {['students','choreographers','everyone'].map(opt => (
                <label key={opt}>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={audience.includes(opt)}
                    onChange={e => handleCheckboxChange(e, setAudience, audience)}
                  />{opt}
                </label>
              ))}
            </div>

            <button type='submit'>Publish</button>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className='feed-container'>
        <div className='post-container'>
          {posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <h3>{post.type}</h3>
              <h4>{post.content}</h4>
              <p>Posted @: {post.created_at}</p>
              <button>edit</button>
              <button>delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
