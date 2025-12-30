import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../constant';
import AdminHeader from './AdminHeader';
import { FaUsers } from "react-icons/fa";


export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  const load = () => axios.get(`${baseUrl}/Admin/userList`).then(res => setCustomers(res.data.listUsers || []));

  useEffect(() => { load(); }, []);

  return (
    <div>
      <AdminHeader />
      <div className="container mt-3">
        <h3 className='text-center'><FaUsers className="mb-1 me-1" size={30}/>Customer List</h3>
        {customers.length === 0 ? <div class="d-flex justify-content-center table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-success"><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody><tr><td colSpan={3}>No customer found</td></tr></tbody>
          </table></div> : (
        <div class="d-flex justify-content-center table-responsive">
          <table className="table table-bordered text-center w-75">
            <thead className="table-success"><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.email}</td>
                  <td>{new Date(c.createdOn).toLocaleString()}</td>
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
