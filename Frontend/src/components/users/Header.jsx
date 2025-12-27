import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FaCapsules} from 'react-icons/fa';
import {IoMdLogOut} from 'react-icons/io';

export default function Header() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("user"); navigate("/"); };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand" style={{cursor:'pointer'}} onClick={()=>navigate('/dashboard')}><FaCapsules className="mb-1 me-1"/>E-Medicine</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><span className="nav-link fw-semibold text-light" style={{cursor:'pointer'}} onClick={()=>navigate('/dashboard')}>Home</span></li>
            <li className="nav-item"><span className="nav-link fw-semibold text-light" style={{cursor:'pointer'}} onClick={()=>navigate('/products')}>Products</span></li>
            <li className="nav-item"><span className="nav-link fw-semibold text-light" style={{cursor:'pointer'}} onClick={()=>navigate('/cart')}>Cart</span></li>
            <li className="nav-item"><span className="nav-link fw-semibold text-light" style={{cursor:'pointer'}} onClick={()=>navigate('/myorders')}>Orders</span></li>
            <li className="nav-item"><span className="nav-link fw-semibold text-light" style={{cursor:'pointer'}} onClick={()=>navigate('/profile')}>My Profile</span></li>
          </ul>
          <button className="btn btn-outline-light" onClick={logout}><IoMdLogOut size={20}/></button>
        </div>
      </div>
    </nav>
  );
}
