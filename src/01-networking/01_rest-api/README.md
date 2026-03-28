# REST API

Small **Express** app that exposes classic **REST** routes over HTTP/JSON: verbs and paths map to CRUD on an in-memory todo list (`data.js`). Sibling examples in `01-networking`: **GraphQL** (`02_graphql`), **gRPC** (`03_grpc`).

## Prerequisites

- Node.js

## Install

From the **repository root**:

```bash
npm install
```

## Run

From the **repository root**:

```bash
npm run start:rest-api
```

Server listens on **http://localhost:3000**.

## npm script (root `package.json`)

| Script           | Role        |
| ---------------- | ----------- |
| `start:rest-api` | Run the API |

## HTTP API

| Method   | Path         | Description                                                                                         |
| -------- | ------------ | --------------------------------------------------------------------------------------------------- |
| `GET`    | `/todos`     | List all todos                                                                                      |
| `POST`   | `/todos`     | Append a todo; send JSON body (e.g. `{ "id": "6", "title": "...", "completed": false }`)            |
| `PUT`    | `/todos/:id` | Replace todo `id` with body fields; `{ "title": "...", "completed": true }` (id comes from the URL) |
| `DELETE` | `/todos/:id` | Remove todo by `id`                                                                                 |

Responses are JSON and include `message` and the full `todos` array where applicable.

## Files

- `index.js` — Express app and routes
- `data.js` — seed `todos` array (in-memory store)

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                 |
| ------------------------ |
| `body-parser`, `express` |
