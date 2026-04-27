# CORS

Express API with `cors` middleware: only listed **Origins** (your static page) may read cross-origin responses. The HTML demo is **not** served by this server.

- `npm run start:cors` — **http://127.0.0.1:3000** (override with `PORT`)

**Client:** open [`client/index.html`](client/index.html) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any static file server (keep the page on an origin in `server/index.js`’s `allowedOrigins`, e.g. `http://127.0.0.1:5500`). Then use **GET `/list`** from the in-page button and watch the Network tab for `Access-Control-Allow-Origin`.

## Files

| Path                 | Role                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| `server/index.js`    | Express + CORS; **GET** `/list` only (API — no `index.html` from this app) |
| `client/index.html`  | Static page; fetch to the API origin above                                 |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages        |
| --------------- |
| `cors`, `express` |
