# FIFI Art Gallery — Base44 Dev Environment

## What this is
A single React component (`GaleriaArte.jsx`) — an art gallery landing page with
category filters, 3D-tilt art cards, and a floating WhatsApp chat widget. It has
no backend, no database, and no external credentials.

## Stack
- Vite 5 + React 18 (dev server on port 3000)
- `lucide-react` for icons (only runtime dependency beyond React)
- No backend / no API / no DB

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
The `web` service uses the `node:22` base image, bind-mounts the repo at `/app`,
runs `npm install` then `npm run dev` (Vite with polling watch for bind mounts).
Source edits hot-reload in the preview.

## Project layout (Base44-scaffolded)
- `GaleriaArte.jsx` — the original component (repo root, unchanged)
- `src/main.jsx` — React entry that mounts `GaleriaArte` into `#root`
- `index.html` — Vite HTML entry
- `vite.config.js` — Vite config (host 0.0.0.0, allowedHosts true, polling)
- `package.json` — dependencies
- `docker-compose.base44.yml` — dev compose

## Verifying it works
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- The served HTML includes `/@vite/client` (live source, not a prebuilt bundle)
- No secrets or external services are required to boot.
