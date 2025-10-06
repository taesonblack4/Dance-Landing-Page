import React , {useEffect, useState}from 'react';
import axios from 'axios';
import useFilterSort from '../../../Common/Hooks/useFilterSort';
import SearchBar from '../../../Common/Utils/SearchBar';
import FilterBar from '../../../Common/Utils/FilterBar';
import { POST_ROUTES } from '../../../Common/db-urls';

//const HOST = 'http://localhost:4004/basic/posts/promos'

const Promos = () => {
  const [posts,setposts] = useState([]);
  const fetchPosts = async () => {
    try {
      const response  = await axios.get(POST_ROUTES.promotions);
      console.log("Fetched posts:", response.data.data); //testing
      setposts(response.data.data);
    } catch (error) {
      console.error('Error fetching promotions:', error)
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    ['audience','category'],
    ['title','content'],
    'created_at',
    'desc'
  );


  return (
    <div>
      <h1>Promos</h1>

      <div>
        <h2>Count: {filteredData.length}</h2>
        <button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Sort by Date: {sortDirection === 'asc'? 'Oldest' : 'Newest'}
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FilterBar
      data={posts}
      filters={filters}
      setFilters={setFilters}
      fieldsToFilter={['audience','category']}
      />
      {/* Feed */}
      <div className='feed-container'>
        <div className='post-container'>
          {filteredData.map(post => (
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

export default Promos
