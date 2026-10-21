import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getDevice } from '../api/devicesApi'
import AsyncState from '../components/AsyncState'
import StatusBadge from '../components/StatusBadge'
import { LOCATION_LABELS, TYPE_ICONS, TYPE_LABELS } from '../utils/constants'
import { formatCost, formatDate, isWarrantyActive } from '../utils/format'

export default function DeviceDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [device, setDevice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getDevice(id, controller.signal)
      .then((result) => { setDevice(result); setLoading(false) })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Unable to load this device')
        setLoading(false)
      })
    return () => controller.abort()
  }, [id, reloadKey])

  return (
    <section className="detail-page">
      <Link to="/" className="back-link">← Back to inventory</Link>
      <AsyncState loading={loading} error={error} empty={!device} emptyText="Device not found" onRetry={() => setReloadKey((key) => key + 1)}>
        {device && <>
          {location.state?.message && <div className="notice"><span>{location.state.message}</span></div>}
          <div className="detail-hero">
            <div className="detail-icon">{TYPE_ICONS[device.type]}</div>
            <div className="detail-title">
              <p className="eyebrow">{TYPE_LABELS[device.type]} · {device.inventoryNumber}</p>
              <h1>{device.name}</h1>
              <StatusBadge status={device.status} />
            </div>
          </div>
          <div className="detail-layout">
            <section className="detail-card">
              <div className="detail-card-heading"><div><p className="eyebrow">DEVICE RECORD</p><h2>Specifications</h2></div><span className="detail-price">{formatCost(device.cost)}</span></div>
              <dl className="detail-list">
                <div><dt>Inventory number</dt><dd>{device.inventoryNumber}</dd></div>
                <div><dt>Device type</dt><dd>{TYPE_LABELS[device.type]}</dd></div>
                <div><dt>Status</dt><dd><StatusBadge status={device.status} /></dd></div>
                <div><dt>Location</dt><dd>{LOCATION_LABELS[device.location] || device.location}</dd></div>
                <div><dt>Assigned to</dt><dd>{device.assignedTo || 'Unassigned'}</dd></div>
                <div><dt>Purchase date</dt><dd>{formatDate(device.purchaseDate)}</dd></div>
                <div><dt>Warranty expiry</dt><dd>{device.warrantyUntil ? <>{formatDate(device.warrantyUntil)} <span className={isWarrantyActive(device.warrantyUntil) ? 'warranty-active' : 'warranty-expired'}>{isWarrantyActive(device.warrantyUntil) ? '· active' : '· expired'}</span></> : 'Not specified'}</dd></div>
              </dl>
              {device.notes && <div className="detail-notes"><h3>Notes</h3><p>{device.notes}</p></div>}
            </section>
            <aside className="detail-aside"><span className="aside-icon">✓</span><h2>Device record</h2><p>This device is available in your inventory. New devices are saved in this browser.</p><Link to="/" className="btn btn-primary">Back to inventory</Link></aside>
          </div>
        </>}
      </AsyncState>
    </section>
  )
}
