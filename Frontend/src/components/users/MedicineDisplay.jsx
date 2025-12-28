import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../constant';
import Header from './Header';
import {MdEventAvailable, MdOutlineSearch} from 'react-icons/md';

function getUserId() {
  const u = JSON.parse(localStorage.getItem('user'));
  return u?.ID ?? u?.id ?? u?.Id;
}

export default function MedicineDisplay() {
  const [medicines, setMedicines] = useState([]);
  const [qty, setQty] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${baseUrl}/Medicines/medicineList`).then(res => {
      if (res.data.statusCode === 200) {
        setMedicines(res.data.listMedicines);
        const initial = {};
        res.data.listMedicines.forEach(m => initial[m.id] = 1);
        setQty(initial);
      }
    });
  }, []);

  const addToCart = async (m) => {
    const userId = getUserId();
    if (!userId) { alert('Please login'); return; }
    const quantity = qty[m.id] || 1;
    const payload = {
      UserId: userId,
      MedicineID: m.id,
      UnitPrice: m.unitPrice,
      Discount: m.discount || 0,
      Quantity: quantity,
      TotalPrice: (m.unitPrice - (m.discount||0)) * quantity
    };
    try {
      const res = await axios.post(`${baseUrl}/Medicines/addToCart`, payload);
      alert(res.data.statusMessage || 'Added to cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  const filteredMedicines = medicines.filter((m) => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

// BLOCK + and -
function handleQtyKeyDown(e) {
  if (e.key === "-" || e.key === "+") e.preventDefault();
}

// HANDLE TYPING
function handleQtyChange(e, id, setQty) {
  const val = e.target.value;

  if (val === "") {
    setQty((q) => ({ ...q, [id]: "" }));
    return;
  }

  const num = parseInt(val);
  if (!isNaN(num)) {
    setQty((q) => ({ ...q, [id]: num }));
  }
}

// FIX VALUE ON BLUR
function handleQtyBlur(id, setQty) {
  setQty((q) => ({
    ...q,
    [id]: q[id] < 1 || q[id] === "" ? 1 : q[id],
  }));
}

  return (
    <div>
      <Header />
      <div className="container mt-3">
        <h3 className='text-center'><MdEventAvailable className='mb-1' />Available Medicines</h3>

        <div className="d-flex justify-content-center gap-2 mb-3">
          <input type="text" className="form-control text-center w-50" placeholder="Search medicines..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-primary fw-semibold" onClick={() => setSearchTerm(searchInput)}>
              <MdOutlineSearch className="mb-1 me-1" size={20}/>Search</button>
        </div>

        <div className="row d-flex justify-content-center">
          {filteredMedicines.length === 0 ? (
            <p>No medicines found.</p>
          ) : (
          filteredMedicines.map((m) => (
            <div className="col-md-4 mb-3" style={{width: 320}} key={m.id}>
              <div id="medicineCard" className="card p-3 bg-light bg-opacity-75 border border-secondary border-opacity-75" style={{height:350}}>
                {m.imageUrl ? (
                  <div id='medicineDiv' className="image-container">
                    <img id='medicineImg' src={m.imageUrl} className="card-img-top bg-light bg-opacity-75 border border-secondary border-opacity-25 rounded" alt={m.name} />
                  </div>
                ) : (<div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{height:180}}>No Image</div>)}
                <div className="card-body p-0">
                  <h5 className="card-title my-1">{m.name}</h5>
                  <div id='manufacturerDiv' className='m-0 p-0'>
                    <p id='manufacturerName' className="card-text mb-3">Manufacturer: {m.manufacturer}</p>
                  </div>
                  <div className="d-flex gap-5 mb-2">
                    <p className="card-text m-0">Price: {m.unitPrice} Rs.</p>
                    <p className="text-danger m-0 fw-medium text-opacity-75">Discount: {m.discount} Rs.</p>
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={qty[m.id] ?? ""}
                      onKeyDown={handleQtyKeyDown}
                      onChange={(e) => handleQtyChange(e, m.id, setQty)}
                      onBlur={() => handleQtyBlur(m.id, setQty)}
                    />
                    <button className="btn btn-primary w-100" onClick={()=>addToCart(m)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
