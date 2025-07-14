import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from '../../api/api';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'staff' // default
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('users/signup', formData);
            toast.success('Signup successful! You can now log in.');
            navigate('/');
        } catch(err) {
            console.log(err);
            toast.error('Signup failed, try again.');
        }
    };
    
    return (
        <div className="login-container">
        <div className="login-box">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <select className="signup-select" name="role" value={formData.role} onChange={handleChange} required>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <button type="submit">Create Account</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>  
    );

};

export default Signup;