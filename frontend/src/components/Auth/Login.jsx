import React, { useState} from 'react';
import API from '../../api/api'; // axios
import { useNavigate } from 'react-router-dom'; // for later

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/users/login', {email, password});
            
            const { token } = response.data;

            // saving to localStorage
            localStorage.setItem('token', token);

            // redirecting to dashboard or products page
            navigate('/products');
        } catch(error) {
            console.error(error);
            setError('Invalid email or password');
        }
    };

    return (
        <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    );
};

export default Login;