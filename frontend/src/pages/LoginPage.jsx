import React from 'react';
import Login from '../components/Auth/Login';

const LoginPage = () => {
    return (
        <div style={{ margin: '2rem'}}>
            <h1>Welcome back!</h1>
            <Login />
        </div>
    );
};

export default LoginPage;