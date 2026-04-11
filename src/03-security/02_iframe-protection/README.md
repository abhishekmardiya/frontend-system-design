# Iframe protection

Run **both** servers for the cross-origin demos (parent on 3000 embeds child on 3001).

- `npm run start:iframe-protection-server1` — **http://localhost:3000** (parent / attacker-style pages: `/example1`, `/example2`, `/example3`)
- `npm run start:iframe-protection-server2` — **http://localhost:3001** (framed pages: `/iframe-website1`, `/iframe-website2`; ports set in each `index.js`)

Server 2 can send `Content-Security-Policy: frame-ancestors 'none'` (uncomment in `server2/index.js`) so browsers block embedding those URLs in a cross-origin iframe; it is left commented so `/example1` can load the child iframe with both servers up.

## Files

| Path                                  | Role                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `server1/index.js`                    | Express static + routes for example HTML (embedder origin)                              |
| `server1/public/example1.html`        | Invisible iframe overlay (clickjacking-style demo) loading child from port 3001         |
| `server1/public/example2.html`        | Parent sets a cookie; child iframe uses `sandbox` (same-origin + scripts) for isolation |
| `server1/public/example3.html`        | Embedding an external site in an iframe (vendor `X-Frame-Options` / CSP may block)      |
| `server2/index.js`                    | Express + global `frame-ancestors 'none'` and demo `Set-Cookie`                         |
| `server2/public/iframe-website1.html` | “Pay Now” button; `if (top !== self)` frame-bust attempt                                |
| `server2/public/iframe-website2.html` | Script tries to read parent DOM (same-origin policy blocks when origins differ)         |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages  |
| --------- |
| `express` |
