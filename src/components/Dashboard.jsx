import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
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