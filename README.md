# URL Shortener Service (Node.js/Express)

Simple URL shortener with an Express API, SQLite storage, and per-device visit tracking (via cookie).

## Getting Started

- Prerequisites: Node.js 18+
- Install dependencies:
  - `npm install`
- Environment (optional): copy `.env.example` to `.env` and adjust values
  - `PORT=3000`
  - `DB_PATH=urls.db`
- Start the app:
  - Dev: `npm run dev`
  - Prod: `npm start`

Visit http://localhost:3000 to use the UI.

## Scripts
- `npm run dev` – start server in watch mode
- `npm start` – start server
- `npm run lint` – run ESLint
- `npm run lint:fix` – fix lint issues
- `npm run format` – check Prettier formatting
- `npm run format:fix` – write Prettier formatting

## Project Structure
- `server.js` – app bootstrap, middleware, static serving, route mounting
- `routes/` – API routes (`/shorten`, `/urls`, `/urls/visits`, redirect `/:shortCode`)
- `db/` – SQLite initialization and schema setup
- `public/` – static frontend (index.html)
- `docs/openapi.yaml` – OpenAPI 3 spec for the API

## API Endpoints

- `GET /urls` – list all URL mappings
- `GET /urls/visits` – list per-device visit rows
- `POST /shorten` – create or return a short URL
  - body: `{ "url": "https://example.com" }`
  - returns: `{ shortCode, shortUrl }`
- `GET /:shortCode` – redirect to the original URL and record a visit

See full schema in `docs/openapi.yaml`.

## Behavior
- Short codes: random, 6–7 URL-safe chars; collision retries applied
- Idempotency: same normalized URL returns the same short code (normalize = lowercase scheme/host, drop fragment)
- Visit tracking: total visits per URL; per-device visit counts keyed by `visitor_id` cookie

## Development
- Linting: ESLint flat config (`eslint.config.cjs`) with jsdoc & node plugins
- Formatting: Prettier (`.prettierrc.json`)
- Types: JSDoc typedefs in `types.js`; key helpers and routes are documented

## Notes
- SQLite DB is created in the project root by default (urls.db). Override path via `DB_PATH`.
- Static frontend is served from `/public`.
