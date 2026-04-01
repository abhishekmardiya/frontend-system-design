# Server-Sent Events

From the repository root: `npm run start:sse` — **http://localhost:3000** (port set in `index.js` via `app.listen`).

Express exposes **`GET /sse`** with `Content-Type: text/event-stream`. The page at **`/`** opens an [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) to `/sse` and appends each `message` event to the page. The server pushes an initial event, then periodic updates every two seconds until the client disconnects (the handler clears the interval on `req` close).

## Files

| File         | Role                                                   |
| ------------ | ------------------------------------------------------ |
| `index.js`   | Express server, `GET /sse` stream, serves `index.html` |
| `index.html` | Demo page; connects with `new EventSource("/sse")`     |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages  |
| --------- |
| `express` |
