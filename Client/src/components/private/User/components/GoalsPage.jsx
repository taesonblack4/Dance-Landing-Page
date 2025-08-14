import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext'; // Import UserContext to access logged-in user info
import axios from 'axios';

const GoalForm = ({goalData, handleChange, onSubmit, onCancel}) => {
    return (
      <>
      {/* Goal creation Form */}
      <div className='form-container'>
        <form onSubmit={onSubmit}>
          <label>Title</label>
          <input 
          type="text" 
          name='title'
          value={goalData.title} 
          onChange={handleChange}
          required/>

          <label>Description</label>
          <textarea
          name="description" 
          id="description" 
          value={goalData.description}
          onChange={handleChange}
          placeholder='Describe what you want to accomplish'
          required
          />

          <label>Category</label>
          <select 
            name="category"
           id="category" 
           value={goalData.category}
           onChange={handleChange}
           required
           >
            <option value="">Select...</option>
            <option value="technique">Technique</option>
            <option value="physical">Physical</option>
            <option value="choreography">Choreography</option>
            <option value="performance">Performance</option>
          </select>

          <label>Status</label>
          <select 
          name="status" 
          id="status" 
          value={goalData.status}
          onChange={handleChange}
          required
          >
            <option value="">Select...</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button type='submit'>Submit</button>
          <button type='button' onClick={onCancel}>cancel</button>
        </form>
      </div>
      </>
    )
  };

const GoalsPage = () => {
  // Get current user object from context
  const { user } = useContext(UserContext);

  // State to hold the list of goals fetched from backend
  const [goals, setGoals] = useState([]);

  // Control form display
  const [showForm, setShowForm] = useState(false);

  //states for goal information management
  //combine fields into 1 object
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    category: '',
    status: ''
  })

  //states for handling updated goal content
  const [editingGoal, setEditingGoal] = useState(null);
  const [updatedGoal, setUpdatedGoal] = useState({
    title: '',
    description: '',
    status: '',
    category: ''
  })

  // State to track loading status for UI feedback
  const [loading, setLoading] = useState(true);

  const HOST = `http://localhost:4004/basic/users/${user.id}/goals`;

  const fetchGoals = async () => {
  try {
    const response = await axios.get(HOST);
    setGoals(response.data.data);
  } catch (err) {
    // Log any error fetching goals
    console.error('Error fetching goals:', err);
  } finally {
    // Toggle loading off after attempt completes (success or fail)
    setLoading(false);
  }
};

  useEffect( () => {
    if (user) fetchGoals();}, [user]); // Dependency array: rerun effect if 'user' changes

  const addGoal = async () => {
    const {title, description, category, status} = goalData;

    if(!title || !description || !status || !category) {
      alert('please fill out missing fields');
      return;
    }

    try {
      await axios.post(HOST, goalData);
      alert('Goal Created');

      //reset fields
      setGoalData({    
        title: '',
        description: '',
        category: '',
        status: ''
      });
      //Refresh goals list
      await fetchGoals(); 
      setShowForm(false); // close form after submission
    } catch (error) {
      console.log('error adding goal: ', error);
      alert('Failed to create Goal');
    }
  };

  const updateGoal = async (id) => {
    try {
      await axios.put(`${HOST}/${id}`, updatedGoal);
      setEditingGoal(null);
      // re-fetch to reflect changes
      fetchGoals();
      setShowForm(false);
    } catch (error) {
      console.error('update fail: ', error);
      alert('errpr updating goal')
    }
  };

  const deleteGoal = async (id) => {
    if(!window.confirm('Delete this Goal?')) return;
    try {
      await axios.delete(`${HOST}/${id}`);
      //refresh list
      setGoals(prev => prev.filter(goal => goal.id !== id))
    } catch (error) {
      console.error('Delete failed: ', error);
      alert('Failed to Delete Goal')
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setGoalData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const startEditing = (goal) => {
    setEditingGoal(goal.id);
    setUpdatedGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      status: goal.status
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    addGoal()
  }


  // While data is loading, show loading message
  if (loading) return <p>Loading goals...</p>;
  // If no goals found, prompt user to add some
  {!goals.length && <p>No goals found. Add some goals!</p>}

  // Render the list of goals with their details
  return (
    <div>
      {/* Display user's full name dynamically */}
      <h1>{user.full_name}'s Goals</h1>

      <button onClick={()=> setShowForm(!showForm)}>
        {showForm ? 'Close Form' : 'Add Goal'}
      </button>

      {showForm && !editingGoal && (
      <GoalForm 
        goalData={goalData}
        handleChange={handleChange}
        onSubmit={onSubmit}
        onCancel={()=> setShowForm(false)}
      />
      )}

      {editingGoal && (
      <GoalForm
        goalData={updatedGoal}
        handleChange={(e) => {
          const { name, value } = e.target;
          setUpdatedGoal(prev => ({ ...prev, [name]: value }));
        }}
        onSubmit={(e) => {
        e.preventDefault();
        updateGoal(editingGoal);
        }}
        onCancel={() => setEditingGoal(null)}
      />
      )}

      
      {goals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
          <p>Status: {goal.status}</p>
          <p>Category: {goal.category}</p>
          <p>Created At: {new Date(goal.created_at).toLocaleString()}</p>
          <p>Updated At: {new Date(goal.updated_at).toLocaleString()}</p>
          <button onClick={() => startEditing(goal)}>update</button>
          <button onClick={() => deleteGoal(goal.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default GoalsPage;
