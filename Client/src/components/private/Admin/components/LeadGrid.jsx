import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from '../../../Common/Utils/FilterBar';
import useFilterSort from '../../../Common/Hooks/useFilterSort';
import SearchBar from '../../../Common/Utils/SearchBar';

const HOST = 'http://localhost:4004/admin/leads/';
{/*
  - [x] count
  - [x] filter (technique/occupation/opportunity progression)
  - [] opportunity tracker (contacted, joined, declined)
  - [x] sort (newest -> oldest)
  - [x] searchbar 
  - [] change views (table/cells)
*/}
export default function LeadGrid() {
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);
  const [updatedLead, setUpdatedLead] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    services: [],
    technique: []
  });

  // Fetch lead data
  useEffect(() => {
    async function fetchLeads() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return window.location.href = '/admin/login';

        const response = await axios.get(HOST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(response.data.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    }
    fetchLeads();
  }, []);

  // Handlers
  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await axios.delete(`${HOST}${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete');
    }
  };

  const startEditing = (lead) => {
    setEditingLead(lead.id);
    setUpdatedLead({
      full_name: lead.full_name,
      email: lead.email,
      phone_number: lead.phone_number,
      services: lead.services || [],
      technique: lead.technique || []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLead(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setUpdatedLead(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(i => i !== value)
    }));
  };

  const updateLead = async (id) => {
    try {
      await axios.put(`${HOST}${id}`, updatedLead, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setEditingLead(null);
      // Re-fetch to reflect changes
      const resp = await axios.get(HOST, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }});
      setLeads(resp.data.data);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update');
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
      leads,
      ['technique','services'], // fileds to filter by
      ['full_name','email'],
      'submitted_at', //date parameter that will be automatically detected inside component
      'desc'                                    //default sort (newest first)
    );


  return (
    <div style={styles.gridContainer}>

      <div>
        <h2>Count: {filteredData.length}</h2>
        <button onClick={()=> setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Sort by Date: {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FilterBar
        data = {leads}
        filters= {filters}
        setFilters={setFilters}
        fieldsToFilter={['technique', 'services']}
      />

      {filteredData.map(lead => (
        <div key={lead.id} style={styles.card}>
          {editingLead === lead.id ? (
            <>
              <input name="full_name" value={updatedLead.full_name} onChange={handleChange} />
              <input name="email" value={updatedLead.email} onChange={handleChange} />
              <input name="phone_number" value={updatedLead.phone_number} onChange={handleChange} />
              <p>Services:</p>
              {['Choreography','Movement Coaching','Private Coaching','Performances','Arts Administration','Teaching','Workshops'].map(s => (
                <label key={s}>
                  <input
                    type="checkbox"
                    value={s}
                    checked={updatedLead.services.includes(s)}
                    onChange={e => handleCheckboxChange(e, 'services')}
                  />{s}
                </label>
              ))}
              <p>Technique:</p>
              {['Hip Hop','Jazz','Modern','Ballet','Contemporary'].map(t => (
                <label key={t}>
                  <input
                    type="checkbox"
                    value={t}
                    checked={updatedLead.technique.includes(t)}
                    onChange={e => handleCheckboxChange(e, 'technique')}
                  />{t}
                </label>
              ))}
              <button onClick={() => updateLead(lead.id)}>Save</button>
              <button onClick={() => setEditingLead(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{lead.full_name}</h3>
              <p>Email: {lead.email}</p>
              <p>Phone: {lead.phone_number}</p>
              <p>Services: {Array.isArray(lead.services) ? lead.services.join(', ') : lead.services}</p>
              <p>Technique: {Array.isArray(lead.technique) ? lead.technique.join(', ') : lead.technique}</p>
              <p>Message: {lead.message}</p>
              <button onClick={() => startEditing(lead)}>Update</button>
              <button onClick={() => deleteLead(lead.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  },
  card: {
    background: '#222',
    color: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '1px solid #444'
  }
};
