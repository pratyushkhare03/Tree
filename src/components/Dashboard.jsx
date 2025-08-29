import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {currentUser?.name}</h2>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-content">
        {/* Add your family tree components here */}
        <p>Your family tree will be displayed here</p>
      </div>
    </div>
  );
};

export default Dashboard;