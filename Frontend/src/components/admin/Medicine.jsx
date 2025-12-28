import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../constant';
import AdminHeader from './AdminHeader';
import {FaTrash, FaEdit} from 'react-icons/fa';
import {MdOutlineBrowserUpdated} from 'react-icons/md';
import {GiMedicines} from 'react-icons/gi';

export default function Medicine() {
  const [form, setForm] = useState({ id: 0, name: '', manufacturer: '', unitPrice: '', discount: '', quantity: '', expDate: '', imageUrl: '', status: 1 });
  const [medicines, setMedicines] = useState([]);
  const [saving, setSaving] = useState(false);

  const onChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const load = () => axios.get(`${baseUrl}/Medicines/medicineList`).then(res => setMedicines(res.data.listMedicines || []));

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ID: form.id,
        Name: form.name,
        Manufacturer: form.manufacturer,
        UnitPrice: parseFloat(form.unitPrice || 0),
        Discount: parseFloat(form.discount || 0),
        Quantity: parseInt(form.quantity || 0),
        ExpDate: form.expDate || null,
        ImageUrl: form.imageUrl || null,
        Status: form.status
      };
      const res = await axios.post(`${baseUrl}/Admin/addUpdateMedicine`, payload);
      alert(res.data.statusMessage || "Saved");
      setForm({ id: 0, name: '', manufacturer: '', unitPrice: '', discount: '', quantity: '', expDate: '', imageUrl: '', status: 1 });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally { setSaving(false); }
  };

  const editMedicine = (m) => setForm({ id: m.id, name: m.name, manufacturer: m.manufacturer, unitPrice: m.unitPrice, discount: m.discount, quantity: m.quantity, expDate: m.expDate, imageUrl: m.imageUrl, status: m.status });

  const deleteMedicine = (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    axios.post(`${baseUrl}/Admin/deleteMedicine`, { ID: id })
      .then(res => { alert(res.data.statusMessage || 'Deleted'); load(); })
      .catch(() => alert('Failed to delete'));
  };

  return (
    <div>
      <AdminHeader />
      <div className="container mt-3">
        <h3 className='text-center'><MdOutlineBrowserUpdated className="mb-1 me-1" size={30} />Add / Update Medicine</h3>
        <form className="bg-light bg-opacity-50 p-4 border border-secondary border-opacity-75 rounded" onSubmit={save}>
          <div className="row row-cols-2">
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="Name">Name of medicine</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="Name" placeholder="Name" value={form.name} onChange={e => onChange('name', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="manufacturer">Name of manufacturer</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="manufacturer" placeholder="Manufacturer" value={form.manufacturer} onChange={e => onChange('manufacturer', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="uPrice">Unit price</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="uPrice" placeholder="Unit Price" value={form.unitPrice} onChange={e => onChange('unitPrice', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="discount">Discount</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="discount" placeholder="Discount" value={form.discount} onChange={e => onChange('discount', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="quantity">Quantity</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="quantity" placeholder="Quantity" value={form.quantity} onChange={e => onChange('quantity', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold" htmlFor="date">Date</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75"
              type="date" value={form.expDate} onChange={e => onChange('expDate', e.target.value)} />
            </div>
            <div className="col-8">
              <label className="form-label fw-semibold" htmlFor="mName">Image URL</label>
              <input className="form-control mb-2 bg-light bg-opacity-75 border border-secondary border-opacity-75 text-opacity-100"
              placeholder="Image URL" value={form.imageUrl} onChange={e => onChange('imageUrl', e.target.value)} />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="img-thumbnail mb-2" style={{ maxWidth: 150 }} />}
            </div>
            <div className="col-12 text-center">
              <button className="btn btn-primary mt-2" disabled={saving} type="submit">{form.id === 0 ? 'Save Medicine' : 'Update Medicine'}</button>
            </div>
          </div>
        </form>

        <h4 className="mt-4 text-center bg-light rounded-pill p-1"><GiMedicines className="mb-2 me-1" />Current Medicines</h4>
        {medicines.length === 0 ? <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th className="w-auto">Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total Price</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody><tr><td colSpan={8}>No medicines to display</td></tr></tbody>
          </table></div> : (
        <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-success">
            <tr>
              <th className="w-auto">Name</th>
              <th>Manufacturer</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.manufacturer}</td>
                <td>{m.unitPrice} Rs.</td>
                <td>{m.discount} Rs.</td>
                <td>{m.unitPrice - m.discount} Rs.</td>
                <td>{m.quantity}</td>
                <td>{m.expDate.slice(0, 10)}</td>
                <td><button className="btn btn-sm btn-warning me-2" onClick={() => editMedicine(m)}><FaEdit className="mb-1 me-1"/>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteMedicine(m.id)}><FaTrash className="mb-1 me-1"/>Delete</button>
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
