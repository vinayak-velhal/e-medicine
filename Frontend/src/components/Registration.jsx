import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from './constant';
import '../Registration.css';

export default function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { FirstName:firstName, LastName:lastName, Password:password, Email:email, Fund:0, Type:"Users", Status:1 };
      const res = await axios.post(`${baseUrl}/Users/registration`, payload);
      if (res.data && (res.data.StatusCode===200 || res.data.statusCode===200)) {
        alert("Registered. Please login.");
        navigate('/');
      } else {
        alert(res.data.statusMessage || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration error: " + err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
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
              placeholder="Create a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Register
          </button>

          <p className="small fw-bold mt-3 mb-0 text-center">
            Already have an account?{" "}
            <Link to="/" className="link-danger">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}