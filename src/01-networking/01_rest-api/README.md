# REST API demo (todos)

Small **Express** app that exposes classic **REST** routes over HTTP/JSON: verbs and paths map to CRUD on an in-memory todo list (`data.js`). Sibling examples in `01-networking`: **GraphQL** (`02_graphql`), **gRPC** (`03_grpc`).

## Prerequisites

- Node.js
- This package uses `"type": "module"` (ESM).

## Install

From this folder (`src/01-networking/01_rest-api`):

```bash
npm install
```

## Run

```bash
npm start
```

Or:

```bash
node index.js
```

Server listens on **http://localhost:3000**.

**Watch mode:** `npm run dev` uses **nodemon** (listed in `devDependencies`) to restart on file changes.

## npm scripts

| Script  | Command            | Role                    |
| ------- | ------------------ | ----------------------- |
| `start` | `node index.js`    | Run the API once        |
| `dev`   | `nodemon index.js` | Restart on file changes |

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
