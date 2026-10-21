import { Link, Route, Routes } from 'react-router-dom'
import DevicesPage from './pages/DevicesPage'
import DeviceDetailPage from './pages/DeviceDetailPage'
import AddDevicePage from './pages/AddDevicePage'

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">D</span>
            <span>DeviceDesk</span>
          </Link>
        </div>
      </header>
      <main className="container main">
        <Routes>
          <Route path="/" element={<DevicesPage />} />
          <Route path="/devices/new" element={<AddDevicePage />} />
          <Route path="/devices/:id" element={<DeviceDetailPage />} />
          <Route path="*" element={<div className="state">Page not found</div>} />
        </Routes>
      </main>
    </>
  )
}
