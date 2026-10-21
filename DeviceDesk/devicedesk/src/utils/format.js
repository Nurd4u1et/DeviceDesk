const costFormatter = new Intl.NumberFormat('en-US')

export const formatCost = (value) => `${costFormatter.format(value)} ₸`

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—')

export const isWarrantyActive = (iso) => new Date(iso) >= new Date()
