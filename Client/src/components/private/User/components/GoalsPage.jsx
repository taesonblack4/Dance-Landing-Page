import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext'; // Import UserContext to access logged-in user info
import axios from 'axios';

const GoalsPage = () => {
  // Get current user object from context
  const { user } = useContext(UserContext);
  // State to hold the list of goals fetched from backend
  const [goals, setGoals] = useState([]);
  // State to track loading status for UI feedback
  const [loading, setLoading] = useState(true);

  const HOST = `http://localhost:4004/basic/users/${user.id}/goals`

  useEffect(() => {
    // If no user is logged in, skip fetching
    if (!user) return;

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
    // Invoke the fetchGoals function
    fetchGoals();
  }, [user]); // Dependency array: rerun effect if 'user' changes

  // While data is loading, show loading message
  if (loading) return <p>Loading goals...</p>;
  // If no goals found, prompt user to add some
  if (!goals.length) return <p>No goals found. Add some goals!</p>;

  // Render the list of goals with their details
  return (
    <div>
      {/* Display user's full name dynamically */}
      <h1>{user.full_name}'s Goals</h1>
      <button>Add Goal</button>

      {goals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
          <p>Status: {goal.status}</p>
          <p>Category: {goal.category}</p>
          <button>update</button>
          <button>delete</button>
        </div>
      ))}
    </div>
  );
};

export default GoalsPage;
