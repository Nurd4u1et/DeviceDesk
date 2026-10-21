const TYPES = {
  laptop: {
    names: ['Dell Latitude 5420', 'Lenovo ThinkPad T14', 'HP EliteBook 840', 'MacBook Air M2', 'ASUS ExpertBook B5'],
    cost: [350000, 900000],
  },
  monitor: {
    names: ['Dell U2723QE', 'LG 27UL850', 'Samsung S27R650', 'HP E24 G5', 'AOC 24B2XH'],
    cost: [80000, 300000],
  },
  phone: {
    names: ['iPhone 13', 'Samsung Galaxy S22', 'Xiaomi Redmi Note 12', 'Google Pixel 7'],
    cost: [150000, 600000],
  },
  accessory: {
    names: ['Logitech MX Master 3', 'Keychron K2', 'Jabra Evolve2 65', 'Dell WD19 Dock', 'Logitech C920 Webcam'],
    cost: [15000, 120000],
  },
}

const TYPE_POOL = ['laptop', 'laptop', 'laptop', 'monitor', 'monitor', 'phone', 'phone', 'accessory', 'accessory']

const STATUS_POOL = ['in_use', 'in_use', 'in_use', 'in_use', 'in_stock', 'in_stock', 'repair', 'written_off']

const EMPLOYEES = [
  'Aidar Satybaldiev', 'Madina Yerlanova', 'Daniyar Kenzhebayev', 'Aliya Nurpeisova',
  'Erlan Zhumabayev', 'Dinara Ospanova', 'Timur Aliyev', 'Assel Bekmuratova',
  'Nurlan Sarsenov', 'Kamila Abenova',
]

const OFFICES = ['Almaty office', 'Astana office', 'Remote']

const NOTES = [
  'Battery replaced',
  'Minor scratches on the case',
  'Purchased with a carrying case',
  'Software update required',
  'Assigned under request IT-12',
]

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[randInt(0, arr.length - 1)]
const toISO = (date) => date.toISOString().slice(0, 10)
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function generateDevices(count = 120) {
  const startTime = new Date(2020, 0, 1).getTime()
  const endTime = new Date(2025, 9, 1).getTime()

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    const type = pick(TYPE_POOL)
    const info = TYPES[type]
    const status = pick(STATUS_POOL)
    const name = pick(info.names)

    const purchase = new Date(randInt(startTime, endTime))
    const warranty = new Date(purchase)
    warranty.setMonth(warranty.getMonth() + pick([24, 36]))

    return {
      id,
      name,
      image: `/images/${slugify(name)}.jpg`,
      inventoryNumber: `INV-${String(id).padStart(5, '0')}`,
      type,
      status,
      location: status === 'in_use' ? pick(OFFICES) : 'Warehouse',
      assignedTo: status === 'in_use' ? pick(EMPLOYEES) : '',
      cost: Math.round(randInt(info.cost[0], info.cost[1]) / 1000) * 1000,
      purchaseDate: toISO(purchase),
      warrantyUntil: toISO(warranty),
      notes: Math.random() < 0.4 ? pick(NOTES) : '',
    }
  })
}
