import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext'; // Import UserContext to access logged-in user info
import axios from 'axios';
import { GOAL_ROUTES } from '../../../Common/db-urls';

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

  //const HOST = `http://localhost:4004/basic/users/me/goals`;

  const fetchGoals = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No Token');

    const response = await axios.get(GOAL_ROUTES.myGoals, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // server returns { success: true, data: [...] }
    const goals = response.data?.data ?? [];
    console.log('fetched goals:', goals);
    setGoals(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    setGoals([]); // fallback
  } finally {
    setLoading(false);
  }
};

  useEffect( () => {
    if (user) fetchGoals();
  }, [user]); // Dependency array: rerun effect if 'user' changes

  const addGoal = async () => {
    const token = localStorage.getItem('accessToken')

    const {title, description, category, status} = goalData;

    if(!title || !description || !status || !category) {
      alert('please fill out missing fields');
      return;
    }

    try {
      await axios.post(GOAL_ROUTES.myGoals, goalData, {
        headers: {Authorization: `Bearer ${token}`}
      });
      alert('Goal Created');

      //Refresh goals list
      await fetchGoals(); 
      setShowForm(false); // close form after submission
      setGoalData({title: '', description: '', category: '', status: ''}); //reset fields
    } catch (error) {
      console.log('error adding goal: ', error);
      alert('Failed to create Goal');
    }
  };

  const updateGoal = async (id) => {
    const token = localStorage.getItem('accessToken')
    try {
      await axios.put(GOAL_ROUTES.goalById(id), updatedGoal, {
        headers: {Authorization: `Bearer ${token}`}
      });
      setEditingGoal(null);
      // re-fetch to reflect changes
      await fetchGoals();
      setShowForm(false);
    } catch (error) {
      console.error('update fail: ', error);
      alert('errpr updating goal')
    }
  };

  const deleteGoal = async (id) => {
    const token = localStorage.getItem('accessToken');

    if(!window.confirm('Delete this Goal?')) return;

    try {
      await axios.delete(GOAL_ROUTES.goalById(id), {
        headers: {Authorization: `Bearer ${token}`}
      });
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
    addGoal();
  }


  // While data is loading, show loading message
  if (loading) return <p>Loading goals...</p>;

  // Render the list of goals with their details
  return (
    <div>
      {/* Display user's full name dynamically */}
      <h1>{user?.full_name}'s Goals</h1>

      <button onClick={()=> setShowForm(!showForm)}>
        {showForm ? 'Close Form' : 'Add Goal'}
      </button>

      {(showForm || editingGoal) && (  // Render GoalForm if adding OR editing
        <GoalForm
          // Choose which data to show:
          // If editingGoal is truthy → use updatedGoal (editing mode)
          // Otherwise → use goalData (creating mode)
          goalData={editingGoal ? updatedGoal : goalData}

          // Choose the correct change handler:
          // If editing → update the updatedGoal state
          // If adding → use the existing handleChange function
          handleChange={editingGoal 
            ? (e) => {
                const { name, value } = e.target;
                setUpdatedGoal(prev => ({ ...prev, [name]: value }));
              }
            : handleChange
          }

          // Decide what happens on submit:
          // If editing → call updateGoal with the current editingGoal id
          // If adding → use the existing onSubmit logic
          onSubmit={(e) => {
            e.preventDefault();
            editingGoal ? updateGoal(editingGoal) : onSubmit(e);
          }}

          // Cancel behavior depends on mode:
          // If editing → clear editingGoal state
          // If adding → hide the form by toggling showForm to false
          onCancel={() => {
            editingGoal ? setEditingGoal(null) : setShowForm(false);
          }}/>
      )}

      
      {goals.length === 0 ? ( 
        <p>No goals found. Add some goals!</p> 
      ): goals.map(goal => (
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
