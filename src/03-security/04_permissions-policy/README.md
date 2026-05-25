# Permissions Policy

Express app that sends a `Permissions-Policy` header disabling geolocation, plus an HTML page that calls `navigator.geolocation` so you can see the browser block or deny access in line with the policy.

From this folder (`npm install` first):

- `npm start` — **http://localhost:3000** (override with `PORT`)

Open **GET `/page`** in the browser; use DevTools **Network** → document response headers to confirm `permissions-policy: geolocation=()`.

## Files

| Path       | Role                                                                                    |
| ---------- | --------------------------------------------------------------------------------------- |
| `index.js` | Express + `Permissions-Policy: geolocation=()`; sample page with Geolocation API button |

## Dependencies

[`package.json`](./package.json).

| Packages  |
| --------- |
| `express` |
