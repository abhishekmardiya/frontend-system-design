# Subresource integrity

Loads lodash from a CDN with `integrity` (and `crossorigin="anonymous"`) so the browser verifies the bytes before running the script. Change the hash in `index.html` to see the load fail.

Open **`index.html`** with VS Code **Live Server** or any static file server (no `npm run` for this example).

Use DevTools **Console** to confirm the lodash sample runs, or **Network** to see the script request.

## Files

| Path         | Role                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `index.html` | Page with external `<script integrity="sha384-…" crossorigin>` demo |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages |
| -------- |
| _none_ (static HTML; CDN script only) |
