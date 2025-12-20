import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from './constant';
import '../Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/Users/login`, { email, password });

      if (res.data.statusCode === 200 && res.data.user) {
        alert("Login successful");

        // Save user info
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.type === "Users") {
          navigate("/dashboard");
        } else {
          navigate("/admindashboard");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check backend.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter an email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">Login</button>

          <p className="small fw-bold mt-3 mb-0 text-center">
            Don't have an account?{" "}
            <Link to="/registration" className="link-danger">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}