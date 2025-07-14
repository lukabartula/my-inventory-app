import React, { useState } from "react";
import { toast } from "react-toastify"; 
import API from "../../api/api"; // axios instance
import { useNavigate, NavLink } from "react-router-dom"; // Import Link

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/users/login", { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/dashboard"); // Update this path if needed
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <p style={{ marginTop: "15px" }}>
        Don't have an account? <NavLink to="/signup">Sign up</NavLink>
      </p>
    </div>
  );
};

export default Login;
