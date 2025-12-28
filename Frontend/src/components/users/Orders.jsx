import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../constant";
import Header from "./Header";
import OrderStatusTracker from "../OrderStatusTracker";
import {GiCheckMark} from 'react-icons/gi';

function getUID() {
  const u = JSON.parse(localStorage.getItem("user"));
  return u?.ID || u?.Id || u?.id;
}

export default function Orders() {
  const userId = getUID();
  const [orders, setOrders] = useState([]);

  // LOAD ORDERS
  const load = useCallback(() => {
    axios
      .post(`${baseUrl}/Medicines/orderList`, { Type: "User", ID: userId })
      .then((res) => setOrders(res.data.listOrders || []))
      .catch((err) => console.error("Load error:", err));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  // CANCEL ORDER
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${baseUrl}/Users/cancelOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: orderId }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        alert("Order cancelled successfully");
        load();
      } else {
        alert(data.statusMessage || "Failed to Cancel");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Error cancelling order");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-3">
        <h3 className='text-center'><GiCheckMark className='mb-2 me-1' />My Orders</h3>

        {orders.length === 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-success"><tr>
                <th>Order No</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Track</th>
                <th>Action</th>
              </tr></thead>
            <tbody><tr><td colSpan={6}>No orders found</td></tr></tbody>
          </table>
        </div>
        ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th>Order No</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Track</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.orderNo}</td>
                  <td>{new Date(o.createdOn).toLocaleString()}</td>
                  <td>{o.orderTotal} Rs.</td>
                  <td>{o.orderStatus}</td>

                  <td>
                      {o.statusDate ? (
                        <p className="p-0" style={{fontSize: 12, marginBottom: 3}}>
                          {o.orderStatus} - ({new Date(o.statusDate).toLocaleString()})
                        </p>
                      ) : (
                        <p className="p-0" style={{fontSize: 12, marginBottom: 3}}>
                          {o.orderStatus} - ({new Date(o.createdOn).toLocaleString()})
                        </p>
                      )}
                    <OrderStatusTracker status={o.orderStatus} />
                  </td>

                  <td>
                    {o.orderStatus === "Pending" ? (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(o.id)}>
                        Cancel
                      </button>
                    ) : (
                      "-"
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