# Cross-Site Scripting

From the repository root: `npm run start:server-side-mitigation` — **http://localhost:3000** for the CSP demo (port set in `server-side-mitigation/index.js` via `app.listen`).

The `vulnerabilities/` HTML files are static examples (open with your editor’s Live Server or similar); they are not wired to an `npm run` script. Open `index.html` for reflected XSS and `eval.html` for **dynamic JavaScript injection** (user-supplied text executed via `eval()`).

## Files

| Path                                       | Role                                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `vulnerabilities/index.html`               | Reflected XSS pattern, attack URLs in comments                                                     |
| `vulnerabilities/eval.html`                | Dynamic JavaScript injection — textarea + **Execute** runs input through `eval()` (unsafe pattern) |
| `server-side-mitigation/index.js`          | Express, `Content-Security-Policy` (nonce, `script-src`, `img-src`), injects nonce into HTML       |
| `server-side-mitigation/public/index.html` | CSP demo page: third-party script, trusted inline (`nonce="%NONCE%"`), untrusted inline (no nonce) |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages  |
| --------- |
| `express` |
