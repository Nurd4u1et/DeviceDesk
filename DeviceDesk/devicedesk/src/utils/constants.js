export const PAGE_SIZE = 12

export const TYPE_LABELS = {
  laptop: 'Laptop',
  monitor: 'Monitor',
  phone: 'Phone',
  accessory: 'Accessory',
}

export const TYPE_ICONS = {
  laptop: '💻',
  monitor: '🖥️',
  phone: '📱',
  accessory: '🖱️',
}

export const STATUS_LABELS = {
  in_use: 'In use',
  in_stock: 'In stock',
  repair: 'In repair',
  written_off: 'Written off',
}

export const LOCATIONS = ['Almaty office', 'Astana office', 'Warehouse', 'Remote']

export const LOCATION_LABELS = {
  'Almaty office': 'Almaty office',
  'Astana office': 'Astana office',
  Warehouse: 'Warehouse',
  Remote: 'Remote',
}

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Purchase date: newest' },
  { value: 'date_asc', label: 'Purchase date: oldest' },
  { value: 'cost_desc', label: 'Price: highest first' },
  { value: 'cost_asc', label: 'Price: lowest first' },
]

export const DEFAULT_FILTERS = {
  type: '',
  status: '',
  location: '',
  sortBy: 'date_desc',
}
