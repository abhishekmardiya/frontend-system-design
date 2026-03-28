# gRPC

## Prerequisites

- Node.js

## Install

From the **repository root**:

```bash
npm install
```

## Run (two terminals)

Run both processes **from the repository root** (see the root **README** for why `.proto` paths use `node:path` + `import.meta.url` in code).

1. **gRPC server** (Protobuf `CustomerService` on **127.0.0.1:30043**):

   ```bash
   npm run start:grpc-server
   ```

   You should see: `gRPC server is listening on 30043`.

2. **HTTP app + gRPC client** (Express on **http://localhost:3000**, calls the gRPC server):

   ```bash
   npm run start:grpc-client
   ```

   Start the gRPC server first; the HTTP layer will fail RPCs if nothing is listening on `30043`.

## npm scripts (root `package.json`)

| Script              | Role                                     |
| ------------------- | ---------------------------------------- |
| `start:grpc-server` | gRPC backend                             |
| `start:grpc-client` | REST-ish routes that use the gRPC client |

## HTTP routes (with `npm run start:grpc-client`)

- `GET /` — list customers (via `GetAll`)
- `POST /create` — JSON body: `name`, `age`, `address`
- `POST /update` — JSON body: `id`, `name`, `age`, `address`
- `POST /remove` — body: `customer_id`

## Files

- `customers.proto` — service and message definitions
- `server/index.js` — gRPC service implementation
- `client/client.js` — gRPC stub targeting `127.0.0.1:30043`
- `client/index.js` — Express app on port `3000`

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                                                                |
| ----------------------------------------------------------------------- |
| `@grpc/grpc-js`, `@grpc/proto-loader`, `body-parser`, `express`, `uuid` |
