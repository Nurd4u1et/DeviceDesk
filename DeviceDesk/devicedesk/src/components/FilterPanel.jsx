import { LOCATIONS, LOCATION_LABELS, SORT_OPTIONS, STATUS_LABELS, TYPE_LABELS } from '../utils/constants'

export default function FilterPanel({ filters, onChange, onReset }) {
  return (
    <div className="filters">
      <label className="field">
        <span>Device type</span>
        <select value={filters.type} onChange={(e) => onChange('type', e.target.value)}>
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Status</span>
        <select value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Location</span>
        <select value={filters.location} onChange={(e) => onChange('location', e.target.value)}>
          <option value="">All locations</option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {LOCATION_LABELS[location] || location}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select value={filters.sortBy} onChange={(e) => onChange('sortBy', e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button className="btn btn-secondary" onClick={onReset}>
        Reset filters
      </button>
    </div>
  )
}
