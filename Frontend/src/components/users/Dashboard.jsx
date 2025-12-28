import React from "react";
import Header from "./Header";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  return (
    <div className="frontPageCards">
      <Header />
      <div className="container-fluid my-2">
        <div id="imageDiv" className="image-container">
          <div id="imageText" className="image-text text-dark">
            <div id="imgText" className="text-md-center text-left">
              <h3 className="fw-bold mb-1">ONLINE PHARMACY</h3>
              <p className="fw-semibold mb-2">Fast and free delivery <br />
                of your medication
              </p>
              <a className="btn btn-primary fw-semibold" href="/products">Shop Now</a>
            </div>
            
            <div className="welcomeText">
              <h2 className="fw-semibold mb-0">Welcome {user ? (user.firstName || user.FirstName || '') : 'User'}</h2>
              <p className="fw-semibold mt-0">Use the options below to manage your profile, orders, and shopping.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>My Profile</h5>
              <p>View and edit your personal details.</p>
              <a className="btn btn-primary" href="/profile">Go</a>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>My Orders</h5>
              <p style={{marginBottom: '40px'}}>Track and manage your orders.</p>
              <a className="btn btn-primary" href="/myorders">Go</a>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>Products</h5>
              <p>Browse and add products to cart.</p>
              <a className="btn btn-primary" href="/products">Go</a>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>Cart</h5>
              <p style={{marginBottom: '40px'}}>View items in your cart.</p>
              <a className="btn btn-primary" href="/cart">Go</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}