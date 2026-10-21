import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getDevices } from '../api/devicesApi'
import useDebounce from '../hooks/useDebounce'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import DeviceCard from '../components/DeviceCard'
import Pagination from '../components/Pagination'
import AsyncState from '../components/AsyncState'
import { DEFAULT_FILTERS } from '../utils/constants'

export default function DevicesPage() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [notice, setNotice] = useState(location.state?.message ?? '')

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    getDevices({ search: debouncedSearch, ...filters, page }, controller.signal)
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Unable to load devices')
        setLoading(false)
      })

    return () => controller.abort()
  }, [debouncedSearch, filters, page, reloadKey])

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handleFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  function handleReset() {
    setSearch('')
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <section className="catalog-page">
      {notice && (
        <div className="notice">
          <span>{notice}</span>
          <button className="notice-close" onClick={() => setNotice('')} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}

      <div className="catalog-hero">
        <div>
          <p className="eyebrow">IT ASSET MANAGEMENT · DEVICEDESK</p>
          <h1>Equipment inventory</h1>
          <p className="page-description">Track company devices, their status, and assigned team members in one place.</p>
        </div>
        <Link to="/devices/new" className="btn btn-primary hero-add"><span aria-hidden="true">＋</span> Add device</Link>
      </div>

      <div className="catalog-summary">
        <div className="summary-mark"><span>▦</span></div>
        <div><strong>{loading ? '…' : data.total}</strong><span>devices in view</span></div>
        <div className="summary-divider" />
        <div className="summary-caption">Search by device name or inventory number</div>
      </div>

      <div className="toolbar">
        <div className="toolbar-top"><div><h2>Device directory</h2><p>Search the inventory or narrow results with filters</p></div><span className="catalog-count">{loading ? 'Loading…' : `${data.total} results`}</span></div>
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      </div>

      <AsyncState
        loading={loading}
        error={error}
        empty={data.items.length === 0}
        emptyText="No devices match your search. Try changing the filters."
        onRetry={() => setReloadKey((k) => k + 1)}
      >
        <>
          <div className="grid">
            {data.items.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      </AsyncState>
    </section>
  )
}
