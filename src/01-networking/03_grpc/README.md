# gRPC demo (customers)

## Prerequisites

- Node.js (this package uses `"type": "module"`)

## Install

From this folder (`src/01-networking/03_grpc`):

```bash
npm install
```

## Run (two terminals)

Scripts assume your current working directory is **`03_grpc`** (same folder as `package.json`), so `customers.proto` resolves correctly.

1. **gRPC server** (Protobuf `CustomerService` on **127.0.0.1:30043**):

   ```bash
   npm run server
   ```

   You should see: `gRPC server is listening on 30043`. Use `npm run dev:server` for **nodemon** (auto-restart on changes).

2. **HTTP app + gRPC client** (Express on **http://localhost:3000**, calls the gRPC server):

   ```bash
   npm run client
   ```

   Use `npm run dev:client` for **nodemon** on the HTTP app.

   Start the gRPC server first; the HTTP layer will fail RPCs if nothing is listening on `30043`.

## npm scripts

| Script   | Command                   | Role                                     |
| -------- | ------------------------- | ---------------------------------------- |
| `server` | `nodemon server/index.js` | gRPC backend                             |
| `client` | `nodemon client/index.js` | REST-ish routes that use the gRPC client |

## HTTP routes (with `npm run client`)

- `GET /` — list customers (via `GetAll`)
- `POST /create` — JSON body: `name`, `age`, `address`
- `POST /update` — JSON body: `id`, `name`, `age`, `address`
- `POST /remove` — body: `customer_id`

## Files

- `customers.proto` — service and message definitions
- `server/index.js` — gRPC service implementation
- `client/client.js` — gRPC stub targeting `127.0.0.1:30043`
- `client/index.js` — Express app on port `3000`
