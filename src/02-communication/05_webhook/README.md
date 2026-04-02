# Webhook

From the repository root: `npm run start:webhook` — **http://localhost:3000** (port set in `index.js` via `app.listen`).

## Files

| File       | Role                                          |
| ---------- | --------------------------------------------- |
| `index.js` | Express server, `POST /webhook`, secret check |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                 |
| ------------------------ |
| `body-parser`, `express` |
