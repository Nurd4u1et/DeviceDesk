import { generateDevices } from '../data/generateDevices'
import { PAGE_SIZE } from '../utils/constants'

const STORAGE_KEY = 'devicedesk_devices'
const ENGLISH_STORAGE_KEY = 'devicedesk_devices_en'
const DELAY = 600

const LEGACY_TEXT = {
  'Айдар Сатыбалдиев': 'Aidar Satybaldiev',
  'Мадина Ерланова': 'Madina Yerlanova',
  'Данияр Кенжебаев': 'Daniyar Kenzhebayev',
  'Алия Нурпеисова': 'Aliya Nurpeisova',
  'Ерлан Жумабаев': 'Erlan Zhumabayev',
  'Динара Оспанова': 'Dinara Ospanova',
  'Тимур Алиев': 'Timur Aliyev',
  'Асель Бекмуратова': 'Assel Bekmuratova',
  'Нурлан Сарсенов': 'Nurlan Sarsenov',
  'Камила Абенова': 'Kamila Abenova',
  'Заменён аккумулятор': 'Battery replaced',
  'Есть царапины на корпусе': 'Minor scratches on the case',
  'Куплен вместе с сумкой': 'Purchased with a carrying case',
  'Требуется обновление ПО': 'Software update required',
  'Выдан по заявке IT-12': 'Assigned under request IT-12',
}

function abortError() {
  return new DOMException('Aborted', 'AbortError')
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }
    const cleanup = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }
    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)
    const onAbort = () => {
      cleanup()
      reject(abortError())
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function save(list) {
  localStorage.setItem(ENGLISH_STORAGE_KEY, JSON.stringify(list))
}

function load() {
  let stored = null
  try {
    stored = JSON.parse(localStorage.getItem(ENGLISH_STORAGE_KEY))
  } catch {
    stored = null
  }
  if (Array.isArray(stored)) return stored

  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    stored = null
  }
  if (Array.isArray(stored)) {
    const migrated = stored.map((device) => ({
      ...device,
      assignedTo: LEGACY_TEXT[device.assignedTo] || device.assignedTo,
      notes: LEGACY_TEXT[device.notes] || device.notes,
    }))
    save(migrated)
    return migrated
  }

  const initial = generateDevices(120)
  save(initial)
  return initial
}

function sortList(list, sortBy) {
  const sorted = [...list]
  if (sortBy === 'date_asc') sorted.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))
  else if (sortBy === 'cost_desc') sorted.sort((a, b) => b.cost - a.cost)
  else if (sortBy === 'cost_asc') sorted.sort((a, b) => a.cost - b.cost)
  else sorted.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))
  return sorted
}

export async function getDevices(params = {}, signal) {
  const {
    search = '',
    type = '',
    status = '',
    location = '',
    sortBy = 'date_desc',
    page = 1,
    pageSize = PAGE_SIZE,
  } = params

  await wait(DELAY, signal)

  const query = search.trim().toLowerCase()
  const filtered = load().filter(
    (d) =>
      (!query || d.name.toLowerCase().includes(query) || d.inventoryNumber.toLowerCase().includes(query)) &&
      (!type || d.type === type) &&
      (!status || d.status === status) &&
      (!location || d.location === location)
  )

  const sorted = sortList(filtered, sortBy)
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: sorted.slice(start, start + pageSize),
    total,
    totalPages,
    page: currentPage,
  }
}

export async function getDevice(id, signal) {
  await wait(DELAY, signal)
  const device = load().find((d) => d.id === Number(id))
  if (!device) throw new Error('Device not found')
  return device
}

export async function addDevice(data) {
  await wait(DELAY)
  const list = load()
  const nextId = list.reduce((max, d) => Math.max(max, d.id), 0) + 1
  const device = {
    ...data,
    id: nextId,
    inventoryNumber: `INV-${String(nextId).padStart(5, '0')}`,
    image: '',
  }
  save([device, ...list])
  return device
}

export async function updateStatus(id, status, assignedTo = '') {
  await wait(DELAY)
  const list = load()
  const index = list.findIndex((d) => d.id === Number(id))
  if (index === -1) throw new Error('Device not found')

  const current = list[index]
  const updated =
    status === 'in_use'
      ? {
          ...current,
          status,
          assignedTo,
          location: current.location === 'Warehouse' ? 'Almaty office' : current.location,
        }
      : { ...current, status, assignedTo: '', location: 'Warehouse' }

  save(list.map((d) => (d.id === updated.id ? updated : d)))
  return updated
}

export async function deleteDevice(id) {
  await wait(DELAY)
  const list = load()
  save(list.filter((d) => d.id !== Number(id)))
}
