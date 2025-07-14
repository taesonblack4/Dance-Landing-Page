import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = 'http://localhost:4004/admin/posts/';

{/*
  - [] add filter (type/audience/category)
  - [] sort (oldest -> newest)
  - [] stats (counts of each)
  - [] change views (table/cells)
*/}

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

  // updating post states
  const [editingPost, setEditingPost] = useState(null);
  const [updatedPost, setUpdatedPost] = useState({
    title: '',
    type: '',
    content: '',
    category: [],
    audience: []
  });

  const startEditing = (post) => {
    setEditingPost(post.id);
    setShowForm(true);
    setUpdatedPost({
      title: post.title,
      type: post.type,
      content: post.content,
      category: post.category || [],
      audience: post.audience || []
    });
  };

  // const handleChange = (e) => {
  //   const {name, value} = e.target;
  //   setUpdatedPost(prev => ({...prev, [name]: value}));
  // }

  const handleCheckboxChange = (e, setter, arr) => {
    const { value, checked } = e.target;
    setter(checked ? [...arr, value] : arr.filter(i => i !== value));
  };

  const updatePost = async (id) => {
    try {
      await axios.put(`${HOST}${id}`, updatedPost, {
        //headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      alert('Post updated');
      setEditingPost(null);
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      console.error('update failed: ', error);
      alert(`failed to update post: ${id}`)
    }
  }

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

  const deletePost = async (id) => {
    if (!window.confirm('Delete this Post?')) return;
    try {
      await axios.delete(`${HOST}${id}`, {
        //headers:
      });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Unable to delete post: ', error);
      alert('Failed to delete Post');
    }
  }

  return (
    <div>
      <h1>Announcements & Promos</h1>

      <div>
        <h1>
          count: {posts.length}
        </h1>
        <button>Filter</button>
        <button>Sort</button>
      </div>

      {/* Toggle form visibility */}
      {showForm ? (
        <button onClick={() => setShowForm(false)}>Cancel</button>
      ) : (
        <button onClick={() => setShowForm(true)}>Create Post</button>
      )}

      {/* Conditionally render the form */}
      {showForm && (
        <div className='form-container'>
          <form onSubmit={e => { e.preventDefault(); editingPost ? updatePost(editingPost) : addPost(); }}>
            <div>
              <label>Title</label>
              <input value={
                editingPost ? updatedPost.title: title} 
                onChange={e => 
                editingPost ? setUpdatedPost((prev)=> ({...prev, title: e.target.value}))
                : setTitle(e.target.value)} required />
            </div>

            <div>
              <label>Content</label>
              <textarea value={ editingPost ? updatedPost.content  : content} 
              onChange={e => 
              editingPost ? setUpdatedPost((prev)=> ({...prev, content: e.target.value}))
              : setContent(e.target.value)} required />
            </div>

            <div>
              <label>Type</label>
              <select value={ editingPost ? updatedPost.type : type} 
              onChange={e => 
              editingPost 
              ? setUpdatedPost((prev) => ({...prev, type: e.target.value}))
              : setType(e.target.value)} required>
                <option value='' disabled>Select…</option>
                <option value='Announcement'>Announcement</option>
                <option value='Promotion'>Promotion</option>
              </select>
            </div>

            <div>
              <label>Category</label>
              {['teaching','coaching','performing'].map(opt => {
                const current = editingPost ? updatedPost.category : category;
                const setter = editingPost
                ? (val) => setUpdatedPost((prev)=> ({...prev, category: val}))
                : setCategory;
                return (
                <label key={opt}>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={current.includes(opt)}
                    onChange={e => handleCheckboxChange(e, setter, current)}
                  />
                  {opt}
                </label>
                );
              })}
            </div>

            <div>
              <label>Audience</label>
              {['students','choreographers','everyone'].map(opt => {
                const current = editingPost ? updatedPost.audience : audience;
                const setter = editingPost
                ? (val) => setUpdatedPost((prev) => ({...prev, audience: val}))
                : setAudience;
                return ( 
                <label key={opt}>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={current.includes(opt)}
                    onChange={e => handleCheckboxChange(e, setter, current)}
                  />
                  {opt}
                </label>
                );
              })}
            </div>

            <button type='submit'>
              {editingPost ? 'Update Post' : 'Publish'}
            </button>
            <button 
              type='button'
              onClick={()=> {
                setShowForm(false);
                setEditingPost(null);
              }}
            >
              Cancel
            </button>
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

              <p>
                Created: {new Date(post.created_at).toLocaleString()}
              </p>

              {post.updated_at && (
                <p>
                  Last Updated: {new Date(post.updated_at).toLocaleString()}
                </p>
              )}    

              <button onClick={()=> startEditing(post)}>edit</button>
              <button onClick={() => deletePost(post.id)}>delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
