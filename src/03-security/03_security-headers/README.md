# Security headers

Small Express app that sets common hardening response headers and shows an HTTPS redirect pattern for deployments behind a reverse proxy.

- `npm run start:security-headers` — **http://localhost:3000** (override with `PORT`)

Use **GET `/list`** for a sample JSON body; inspect response headers in DevTools or `curl -I`.

## Files

| Path       | Role                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `index.js` | Express + `Referrer-Policy`, `X-Content-Type-Options`, HSTS, `X-Powered-By` removal; HTTPS redirect when `X-Forwarded-Proto` is `http` |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages  |
| --------- |
| `express` |
