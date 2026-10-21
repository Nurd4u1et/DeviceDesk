# DeviceDesk

DeviceDesk is a React single-page application for managing an organization's IT equipment. The interface is in English and uses a simulated asynchronous API backed by browser `localStorage`.

## Features

- 120 generated starter devices, saved locally after the first visit.
- Search by device name or inventory number.
- Filter by device type, status, and location.
- Sort by purchase date or cost and browse with pagination.
- Open a device record and add a new device with a controlled form.
- Loading, error, empty, and success states.
- Responsive layout for desktop and mobile.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

- `src/api/devicesApi.js` — simulated API with request delays and local storage.
- `src/data/generateDevices.js` — creates the initial set of 120 devices.
- `src/pages/DevicesPage.jsx` — inventory, search, filters, and pagination.
- `src/pages/DeviceDetailPage.jsx` — loads one device by ID.
- `src/pages/AddDevicePage.jsx` — controlled device entry form.
- `src/components/` — reusable cards, filters, pagination, and async states.

Page effects cancel pending requests with `AbortController`. Form fields are controlled by React state, and new devices are added through the simulated API.

## Deployment

The project is configured for Vercel. `vercel.json` rewrites direct SPA routes to `index.html`.

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Use the default Vite settings: build command `npm run build`, output directory `dist`.
4. After deployment, check the inventory, a device detail route, and refreshing a URL such as `/devices/1`.

Data is stored in the visitor's browser and is not shared across devices or browsers.
