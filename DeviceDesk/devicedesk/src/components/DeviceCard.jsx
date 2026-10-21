import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { TYPE_ICONS, TYPE_LABELS } from '../utils/constants'
import { formatCost } from '../utils/format'

export default function DeviceCard({ device }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = device.image && !imageFailed

  return (
    <Link to={`/devices/${device.id}`} className="card">
      <div className="card-media">
        {showImage ? (
          <img src={device.image} alt={device.name} loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <span className="card-placeholder">{TYPE_ICONS[device.type]}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{device.name}</h3>
        <p className="card-meta">
          {device.inventoryNumber} · {TYPE_LABELS[device.type]}
        </p>
        <StatusBadge status={device.status} />
        <p className="card-line">{device.assignedTo || 'Unassigned'}</p>
        <p className="card-line">{device.location}</p>
        <p className="card-cost">{formatCost(device.cost)}</p>
      </div>
    </Link>
  )
}
