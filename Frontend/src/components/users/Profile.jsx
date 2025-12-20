import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../constant';
import Header from './Header';
import {AiOutlineProfile} from 'react-icons/ai';

export default function Profile() {
  const [profile,setProfile] = useState({});
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;
    axios.post(`${baseUrl}/Users/viewUser`, { ID: u.ID ?? u.id ?? u.Id})
      .then(res => {
        if (res.data.statusCode === 200) {
          setProfile(res.data.user);
          setFirstName(res.data.user.firstName);
          setLastName(res.data.user.lastName);
        }
      });
  },[]);
  const updateProfile = async () => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;
    const payload = { ID: u.ID ?? u.id ?? u.Id, FirstName:firstName, LastName:lastName, Email: profile.email };
    const res = await axios.post(`${baseUrl}/Users/updateProfile`, payload);
    alert(res.data.statusMessage);
  };
  return (
    <div>
      <Header />
      <div className="container mt-3">
        <h3 className="text-center"><AiOutlineProfile className="mb-2" />My Profile</h3>
        <div className="d-flex justify-content-center">
          <div id="profileCard" 
          className="card p-4 bg-light bg-opacity-50 border border-secondary border-opacity-75 shadow"
          style={{width: 335}}>
            <label className='mb-2'><strong>Name:</strong></label>
            <div className="d-flex gap-2 mb-3">
              <input className="form-control bg-light" value={firstName} onChange={e=>setFirstName(e.target.value)} />
              <input className="form-control bg-light" value={lastName} onChange={e=>setLastName(e.target.value)} />
            </div>
            <label className='mb-2'><strong>Email:</strong></label>
            <input className="form-control mb-3 text-bg-secondary fw-semibold bg-opacity-50 border border-secondary border-opacity-75" value={profile.email || ''} disabled />
            <div className="mb-3">
              <strong>Member since:</strong> {profile.createdOn ? new Date(profile.createdOn).toLocaleString() : ''}
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={updateProfile}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
