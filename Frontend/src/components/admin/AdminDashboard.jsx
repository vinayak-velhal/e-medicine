import React from "react";
import AdminHeader from "./AdminHeader";

export default function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');

  return (
    <div>
      <AdminHeader />
            <div className="container-fluid my-2">
        <div id="imageDiv" className="image-container">
          <img id="frontPageImage" src="./src/assets/FrontPage_Background_Image2.jpg"/>
          <div id="imageText" className="image-text text-dark">
            <div id="imgText">
              <div className="text-center">
                <h3 className="fw-bold mb-1">ONLINE PHARMACY</h3>
                <p className="fw-semibold mb-2">Fast and free delivery <br />
                  of medication
                </p>
              </div>
            </div>
            <div id="AdminText" className="welcomeText">
              <h2 className="fw-semibold">Welcome {admin ? (admin.firstName || admin.FirstName || '') : 'Admin'}</h2>
              <p className="fw-semibold">Use the options below to manage Products, orders, and customers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row mt-4">
          <div className="col-md-4">
            <div id="profileCard" className="card text-center p-3 shadow-sm">
              <h5>Products</h5>
              <p>Add, update, or remove Products.</p>
              <a className="btn btn-dark" href="/medicine">Manage</a>
            </div>
          </div>

          <div className="col-md-4">
            <div id="profileCard" className="card text-center p-3 shadow-sm">
              <h5>Orders</h5>
              <p>View and update customer orders.</p>
              <a className="btn btn-dark" href="/adminorders">Manage</a>
            </div>
          </div>

          <div className="col-md-4">
            <div id="profileCard" className="card text-center p-3 shadow-sm">
              <h5>Customers</h5>
              <p>View registered customers.</p>
              <a className="btn btn-dark" href="/customers">View</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}