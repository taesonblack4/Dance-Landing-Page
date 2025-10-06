import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from '../../../Common/Utils/FilterBar';
import useFilterSort from '../../../Common/Hooks/useFilterSort';
import SearchBar from '../../../Common/Utils/SearchBar';
import {ADMIN_ROUTES} from '../../../Common/db-urls.js'

//const HOST = 'http://localhost:4004/admin/posts/';

{/*
  - [x] add filter (type/audience/category)
  - [x] sort (oldest -> newest)
  - [x] stats (counts of each)
  - [x] search
  - [] change views (table/cells)
*/}

export default function Posts() {
  // -------------------------
  // Section: Form Visibility
  // -------------------------
  const [showForm, setShowForm] = useState(false); // toggle between feed and form view

  // -----------------------
  // Section: Data Fetching
  // -----------------------
  const [posts, setPosts] = useState([]); // raw posts array
  const fetchPosts = async () => {
    try {
      const response = await axios.get(ADMIN_ROUTES.allPosts);
      // response.data.data expected to be array of posts
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  // fetch on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // ----------------------------------
  // Section: Create / Edit Form State
  // ----------------------------------
  // Creating a new post fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState([]);
  const [audience, setAudience] = useState([]);

  // Editing an existing post
  const [editingPost, setEditingPost] = useState(null); // hold post.id if editing
  const [updatedPost, setUpdatedPost] = useState({
    title: '',
    type: '',
    content: '',
    category: [],
    audience: []
  });

  // initialize form for editing
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

  // helper for checkbox fields
  const handleCheckboxChange = (e, setter, arr) => {
    const { value, checked } = e.target;
    setter(checked ? [...arr, value] : arr.filter(i => i !== value));
  };

  // ----------------------
  // Section: CRUD Handlers
  // ----------------------

  // Update existing post via PUT
  const updatePost = async (id) => {
    try {
      await axios.put(ADMIN_ROUTES.postById(id), updatedPost);
      alert('Post updated');
      setEditingPost(null);    // exit edit mode
      setShowForm(false);      // hide form
      fetchPosts();            // refresh feed
    } catch (error) {
      console.error('update failed: ', error);
      alert(`Failed to update post: ${id}`);
    }
  };

  // Create new post via POST
  const addPost = async () => {
    // basic validation
    if (!title || !type || !content) {
      alert('Please fill out title, type, and content');
      return;
    }
    try {
      await axios.post(ADMIN_ROUTES.allPosts, { title, type, content, category, audience });
      alert('Post added');
      // reset form fields
      setTitle(''); setType(''); setContent('');
      setCategory([]); setAudience([]);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err);
      alert('Failed to add post');
    }
  };

  // Delete a post via DELETE
  const deletePost = async (id) => {
    if (!window.confirm('Delete this Post?')) return;
    try {
      await axios.delete(ADMIN_ROUTES.postById(id));
      // remove locally without re-fetch
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Unable to delete post: ', error);
      alert('Failed to delete Post');
    }
  };

  // ------------------------------------
  // Section: Filtering & Sorting Setup
  // ------------------------------------
  // useFilterSort returns:
  //   filteredData: Array, --> Data after filtering, searching, & sorting
  //   filters: Object,   -->  Current filter values per field
  //   setFilters: Function,   -->  Update filters
  //  sortDirection: string,   -->    Current sort direction
  //   setSortDirection: Function, --> Toggle sort direction
  //  searchQuery: string,   -->   Current search string
  //   setSearchQuery: Function  -->  Set search string
   const {
    filteredData,
    filters,
    setFilters,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery
  } = useFilterSort(
      posts,
      ['type','category','audience'], // fields to filter by
      ['title', 'content'],
      'created_at',
      'desc'                          // default sort (newest first)
  );

  // --------------------------------
  // Section: Render JSX
  // --------------------------------
  return (
    <div>
      {/* Page Title */}
      <h1>Announcements & Promos</h1>

      {/* Stats & Sort Toggle */}
      <div>
        <h2>Count: {filteredData.length}</h2> {/* show number of filtered posts */}
        {/* toggle between ascending/descending by created_at */}
        <button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Sort by Date: {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* FilterBar: dropdowns for type, category, audience */}
      <FilterBar
        data={posts}
        filters={filters}
        setFilters={setFilters}
        fieldsToFilter={['type', 'category', 'audience']}
      />

      {/* Create/Edit Form Toggle */}
      {showForm ? (
        <button onClick={() => { setShowForm(false); setEditingPost(null); }}>Cancel</button>
      ) : (
        <button onClick={() => setShowForm(true)}>Create Post</button>
      )}

      {/* Conditionally show form for create or edit */}
      {showForm && (
        <div className='form-container'>
          <form onSubmit={e => { e.preventDefault(); editingPost ? updatePost(editingPost) : addPost(); }}>
            {/* Title Input */}
            <div>
              <label>Title</label>
              <input
                value={editingPost ? updatedPost.title : title}
                onChange={e => editingPost
                  ? setUpdatedPost(prev => ({ ...prev, title: e.target.value }))
                  : setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label>Content</label>
              <textarea
                value={editingPost ? updatedPost.content : content}
                onChange={e => editingPost
                  ? setUpdatedPost(prev => ({ ...prev, content: e.target.value }))
                  : setContent(e.target.value)}
                required
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label>Type</label>
              <select
                value={editingPost ? updatedPost.type : type}
                onChange={e => editingPost
                  ? setUpdatedPost(prev => ({ ...prev, type: e.target.value }))
                  : setType(e.target.value)}
                required
              >
                <option value='' disabled>Select…</option>
                <option value='Announcement'>Announcement</option>
                <option value='Promotion'>Promotion</option>
              </select>
            </div>

            {/* Category Checkboxes */}
            <div>
              <label>Category</label>
              {['teaching','coaching','performing'].map(opt => {
                // determine current array and setter based on create vs edit mode
                const current = editingPost ? updatedPost.category : category;
                const setter = editingPost
                  ? val => setUpdatedPost(prev => ({ ...prev, category: val }))
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

            {/* Audience Checkboxes */}
            <div>
              <label>Audience</label>
              {['students','choreographers'].map(opt => {
                const current = editingPost ? updatedPost.audience : audience;
                const setter = editingPost
                  ? val => setUpdatedPost(prev => ({ ...prev, audience: val }))
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

            {/* Submit & Cancel Buttons */}
            <button type='submit'>{editingPost ? 'Update Post' : 'Publish'}</button>
            <button type='button' onClick={() => { setShowForm(false); setEditingPost(null); }}>Cancel</button>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className='feed-container'>
        <div className='post-container'>
          {filteredData.map(post => (
            <div key={post.id}>
              {/* Post details */}
              <h2>{post.title}</h2>
              <h3>{post.type}</h3>
              <h4>{post.content}</h4>

              {/* Timestamps */}
              <p>Created: {new Date(post.created_at).toLocaleString()}</p>
              {post.updated_at && <p>Last Updated: {new Date(post.updated_at).toLocaleString()}</p>}

              {/* Action buttons */}
              <button onClick={() => startEditing(post)}>Edit</button>
              <button onClick={() => deletePost(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
