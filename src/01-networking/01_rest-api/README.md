# REST API

From the repository root: `npm run start:rest-api` — server at **http://localhost:3000**.

## HTTP API

| Method   | Path         | Description                                                                                         |
| -------- | ------------ | --------------------------------------------------------------------------------------------------- |
| `GET`    | `/todos`     | List all todos                                                                                      |
| `POST`   | `/todos`     | Append a todo; send JSON body (e.g. `{ "id": "6", "title": "...", "completed": false }`)            |
| `PUT`    | `/todos/:id` | Replace todo `id` with body fields; `{ "title": "...", "completed": true }` (id comes from the URL) |
| `DELETE` | `/todos/:id` | Remove todo by `id`                                                                                 |

Responses are JSON and include `message` and the full `todos` array where applicable.

## Files

| File       | Role                                 |
| ---------- | ------------------------------------ |
| `index.js` | Express app and routes               |
| `data.js`  | Seed `todos` array (in-memory store) |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                 |
| ------------------------ |
| `body-parser`, `express` |
