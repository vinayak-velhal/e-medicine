import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '../constant';
import Header from './Header';
import {FaCartPlus} from 'react-icons/fa';


function getUserId() {
  const u = JSON.parse(localStorage.getItem('user'));
  return u?.ID ?? u?.id ?? u?.Id;
}

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const userId = getUserId();

  const load = useCallback(() => {
    if (!userId) return;
    axios.post(`${baseUrl}/Medicines/cartList`, { ID: userId })
      .then(res => {
        const list = res.data.listCart || [];
        setCart(list);
        setTotal(list.reduce((s,i)=>s + (i.totalPrice||0),0));
      });
  }, [userId]);

  useEffect(()=>{ load(); }, [load]);

  const remove = (cartId) => {
    axios.post(`${baseUrl}/Users/removeFromCart`, { ID: cartId })
      .then(res => { alert(res.data.statusMessage || 'Removed'); load(); })
      .catch(()=>alert('Failed to remove'));
  };

  const placeOrder = () => {
    if (cart.length === 0) { alert('Cart empty'); return; }
    axios.post(`${baseUrl}/Medicines/placeOrder`, { ID: userId })
      .then(res => { alert(res.data.statusMessage || 'Order placed'); load(); })
      .catch(()=>alert('Failed to place order'));
  };

  return (
    <div>
      <Header />
      <div className="container mt-3">
        <h3 className='text-center'><FaCartPlus className="mb-2 me-1"/>My Cart</h3>
        {cart.length === 0 ? <div>
          <table className="table table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody><tr><td colSpan={6}>No items in cart</td></tr></tbody>
          </table></div> : (
          <table className="table table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
              </thead>
            <tbody>
              {cart.map(c=>(
                <tr key={c.id}>
                  <td>{c.medicineName}</td>
                  <td>{c.quantity}</td>
                  <td>{c.unitPrice} Rs.</td>
                  <td>{c.discount} Rs.</td>
                  <td>{c.totalPrice} Rs.</td>
                  <td><button className="btn btn-sm btn-danger" onClick={()=>remove(c.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className='d-flex flex-column align-items-end'>
          <h5 className='bg-light rounded p-2'>Total: {total} Rs.</h5>
          <button className="btn btn-success fw-semibold" style={{width: 111, height:38}} onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
