import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FaCapsules} from 'react-icons/fa';
import {IoMdLogOut} from 'react-icons/io';

export default function AdminHeader() {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admindashboard"><FaCapsules className="mb-1 me-1"/>E-Medicine</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link fw-semibold text-light" to="/AdminDashboard">Home</Link></li>
            <li className="nav-item"><Link className="nav-link fw-semibold text-light" to="/medicine">Medicine Management</Link></li>
            <li className="nav-item"><Link className="nav-link fw-semibold text-light" to="/adminorders">Order Management</Link></li>
            <li className="nav-item"><Link className="nav-link fw-semibold text-light" to="/customers">Customer List</Link></li>
          </ul>

          <div className="d-flex">
            <button className="btn btn-outline-light" onClick={handleLogout}><IoMdLogOut size={20}/></button>
          </div>
        </div>
      </div>
    </nav>
  );
}
