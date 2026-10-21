import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addDevice } from '../api/devicesApi'
import { STATUS_LABELS, TYPE_LABELS } from '../utils/constants'

const initialForm = {
  name: '',
  type: 'laptop',
  status: 'in_stock',
  location: 'Warehouse',
  assignedTo: '',
  cost: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  warrantyUntil: '',
  notes: '',
}

export default function AddDevicePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const device = await addDevice({
        ...form,
        cost: Number(form.cost),
        assignedTo: form.status === 'in_use' ? form.assignedTo.trim() : '',
        location: form.status === 'in_stock'
          ? 'Warehouse'
          : form.status === 'in_use' && form.location === 'Warehouse'
            ? 'Almaty office'
            : form.location,
      })
      navigate(`/devices/${device.id}`, { state: { message: 'Device added to the inventory.' } })
    } catch (err) {
      setError(err.message || 'Could not save the device. Please try again.')
      setSaving(false)
    }
  }

  return (
    <section className="form-page">
      <Link to="/" className="back-link">← Back to inventory</Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">EQUIPMENT INVENTORY</p>
          <h1>Add a device</h1>
          <p className="page-description">Enter the device details to add it to your inventory.</p>
        </div>
      </div>

      <form className="device-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">01</span>
            <div><h2>Device information</h2><p>Name, category, and current status</p></div>
          </div>
          <div className="form-grid">
            <label className="field field-wide"><span>Device name <b>*</b></span><input name="name" value={form.name} onChange={handleChange} placeholder="For example, MacBook Pro 14″" maxLength={80} required /></label>
            <label className="field"><span>Device type <b>*</b></span><select name="type" value={form.type} onChange={handleChange}>{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="field"><span>Status <b>*</b></span><select name="status" value={form.status} onChange={handleChange}>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="field"><span>Location</span><select name="location" value={form.location} onChange={handleChange}><option value="Warehouse">Warehouse</option><option value="Almaty office">Almaty office</option><option value="Astana office">Astana office</option><option value="Remote">Remote</option></select></label>
            {form.status === 'in_use' && <label className="field"><span>Assigned to <b>*</b></span><input name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Full name" maxLength={80} required /></label>}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">02</span>
            <div><h2>Purchase and warranty</h2><p>Cost, purchase date, and warranty coverage</p></div>
          </div>
          <div className="form-grid">
            <label className="field"><span>Cost (₸) <b>*</b></span><input name="cost" type="number" min="0" step="1000" value={form.cost} onChange={handleChange} placeholder="450000" required /></label>
            <label className="field"><span>Purchase date <b>*</b></span><input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} required /></label>
            <label className="field"><span>Warranty expiry</span><input name="warrantyUntil" type="date" value={form.warrantyUntil} onChange={handleChange} /></label>
            <label className="field field-wide"><span>Notes</span><textarea name="notes" value={form.notes} onChange={handleChange} rows="3" maxLength={300} placeholder="Condition, accessories, or other details" /></label>
          </div>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="form-actions"><Link to="/" className="btn btn-secondary">Cancel</Link><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add device'}</button></div>
      </form>
    </section>
  )
}
