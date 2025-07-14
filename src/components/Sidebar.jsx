import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">My inventory app</h2>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" activeclassName="active">Dashboard</NavLink>
                <NavLink to="/transactions" activeclassname="active">Transactions</NavLink>
                <NavLink to="/sales" activeclassname="active">Sales</NavLink>
                <NavLink to="/analytics" activeclassname="active">Analytics</NavLink>
                <NavLink to="/profile" activeclassname="active">Profile</NavLink>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    );
};

export default Sidebar;