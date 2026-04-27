# Subresource integrity

Static page served by Express: loads lodash from a CDN with `integrity` (and `crossorigin="anonymous"`) so the browser verifies the bytes before running the script. Change the hash in `index.html` to see the load fail.

- `npm run start:subresource-integrity` — **http://localhost:3000**

Open **GET /** in the browser; use DevTools **Console** to confirm the lodash sample runs, or **Network** to see the script request.

## Files

| Path         | Role                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `index.js`   | Express serves `index.html` at `/`                                   |
| `index.html` | Page with external `<script integrity="sha384-…" crossorigin>` demo |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages  |
| --------- |
| `express` |
