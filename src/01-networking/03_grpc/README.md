# gRPC

From the repository root, use two terminals (start the gRPC server first):

1. `npm run start:grpc-server` — **127.0.0.1:30043** (`CustomerService`; you should see `gRPC server is listening on 30043`).
2. `npm run start:grpc-client` — **http://localhost:3000** (Express + gRPC client; RPCs fail if nothing is on `30043`).

## HTTP routes (`npm run start:grpc-client`)

- `GET /` — list customers (via `GetAll`)
- `POST /create` — JSON body: `name`, `age`, `address`
- `POST /update` — JSON body: `id`, `name`, `age`, `address`
- `POST /remove` — body: `customer_id`

## Files

| File               | Role                                  |
| ------------------ | ------------------------------------- |
| `customers.proto`  | Service and message definitions       |
| `server/index.js`  | gRPC service implementation           |
| `client/client.js` | gRPC stub targeting `127.0.0.1:30043` |
| `client/index.js`  | Express app on port **3000**          |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                                                                |
| ----------------------------------------------------------------------- |
| `@grpc/grpc-js`, `@grpc/proto-loader`, `body-parser`, `express`, `uuid` |
