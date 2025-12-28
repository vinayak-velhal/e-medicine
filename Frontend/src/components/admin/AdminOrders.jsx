import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../constant";
import AdminHeader from "./AdminHeader";
import {GiCheckMark} from 'react-icons/gi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  // LOAD ALL ORDERS (Admin)
  const load = () => {
    axios
      .post(`${baseUrl}/Medicines/orderList`, { Type: "Admin", ID: 0 })
      .then((res) => setOrders(res.data.listOrders || []))
      .catch((err) => console.error("Load error:", err));
  };

  useEffect(() => {
    load();
  }, []);

  // UPDATE ORDER STATUS
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${baseUrl}/Admin/updateOrderStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: orderId,
          orderStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        alert("Status updated successfully");
        load(); // FIXED (reload orders)
      } else {
        alert(data.statusMessage || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating status");
    }
  };

  // Allowed Status Transition Rules
  const allowedOptions = (current) => {
    if (current === "Pending") return ["Dispatched", "Cancelled"];
    if (current === "Dispatched") return ["Shipped"];
    if (current === "Shipped") return ["Delivered"];
    return []; // Delivered or Cancelled
  };

  return (
    <div>
      <AdminHeader />
      <div className="container mt-3">
        <h3 className='text-center'><GiCheckMark className='mb-2 me-1' />All Orders</h3>
        {orders.length === 0 ? <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-success"><tr>
              <th>Customer</th>
              <th>Order No</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr></thead>
            <tbody><tr><td colSpan={6}>No orders found</td></tr></tbody>
          </table></div> : (
        <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-success">
            <tr>
              <th>Customer</th>
              <th>Order No</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.customerName}</td>
                <td>{o.orderNo}</td>
                <td>{new Date(o.createdOn).toLocaleString()}</td>
                <td>{o.orderTotal} Rs.</td>
                <td>{o.orderStatus}</td>
                <td>
                  {allowedOptions(o.orderStatus).length === 0 ? (
                    "-"
                  ) : (
                    <select
                      className="form-select"
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      <option value={o.orderStatus}>{o.orderStatus}</option>

                      {allowedOptions(o.orderStatus).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>        
        </table>
        </div>
        )}
      </div>
    </div>
  );
}