# WebSocket

From the repository root: `npm run start:websocket` — **http://localhost:3000** (port set in `index.js` via `server.listen`).

Express serves the chat page; [Socket.IO](https://socket.io/) runs on the same HTTP server and exposes the client bundle at `/socket.io/socket.io.js`.

## Client script

The demo loads the browser client from the server URL (same origin as the page). In `index.html`:

```html
<script src="/socket.io/socket.io.js"></script>
```

the file is actually **served by this Socket.IO server** at `/socket.io/socket.io.js`. For bundlers or SSR apps you typically install **`socket.io-client`** from npm instead of a script tag.

## Files

| File         | Role                                                  |
| ------------ | ----------------------------------------------------- |
| `index.js`   | Express + HTTP server, Socket.IO, serves `index.html` |
| `index.html` | Chat UI; connects with `window.io()`                  |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages               |
| ---------------------- |
| `express`, `socket.io` |
