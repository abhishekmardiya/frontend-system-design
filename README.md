# Frontend System Design

- This project is the practice of designing and building scalable, maintainable frontend applications.
- It focuses on architecture, trade-offs, and implementation patterns.
- It explores how systems work end-to-end—from APIs and state to UI and performance.

## Concepts

### [Networking](src/01-networking)

| Topic       | Code                                           |
| ----------- | ---------------------------------------------- |
| **REST**    | `[01_rest-api](src/01-networking/01_rest-api)` |
| **GraphQL** | `[02_graphql](src/01-networking/02_graphql)`   |
| **gRPC**    | `[03_grpc](src/01-networking/03_grpc)`         |

### [Communication](src/02-communication)

| Topic             | Code                                                        |
| ----------------- | ----------------------------------------------------------- |
| **Short polling** | `[01_short-polling](src/02-communication/01_short-polling)` |
| **Long polling**  | `[02_long-polling](src/02-communication/02_long-polling)`   |
| **WebSocket**     | `[03_websocket](src/02-communication/03_websocket)`         |
| **SSE**           | `[04_sse](src/02-communication/04_sse)`                     |
| **Webhook**       | `[05_webhook](src/02-communication/05_webhook)`             |

### [Security](src/03-security)

| Topic                          | Code                                                           |
| ------------------------------ | -------------------------------------------------------------- |
| **Cross-Site Scripting (XSS)** | `[01_xss](src/03-security/01_xss)`                             |
| **Iframe protection**          | `[02_iframe-protection](src/03-security/02_iframe-protection)` |
| **Security headers**           | `[03_security-headers](src/03-security/03_security-headers)`   |
| **Permissions Policy**         | `[04_permissions-policy](src/03-security/04_permissions-policy)` |

## Setup

**Dependencies are managed in a single `package.json` at the repository root.** There are no per-folder `package.json` files. Install once from the root:

```bash
npm install
```

**Modules use ESM:** the root manifest sets `"type": "module"`, so `.js` files are treated as ES modules.

**Paths to files on disk** the current working directory is usually the **repo root**, not the chapter folder. So **do not rely on** paths like `./some-file.js`. Build an absolute path with `**node:path`** and `**import.meta.url\*\*`(via`fileURLToPath`) so the file resolves next to the module, independent of where you started Node.

## Run examples

From the repository root. All `**start:…**` scripts run through **[nodemon](https://nodemon.io/)**; each script only watches its chapter folder so restarts stay cheap.

| Script                                    | What it runs                                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run start:rest-api`                  | REST todos API → **[http://localhost:3000](http://localhost:3000)**                                                                                           |
| `npm run start:graphql`                   | Apollo GraphQL → **[http://localhost:4000](http://localhost:4000)**                                                                                           |
| `npm run start:graphql-fetch`             | Sample `fetch` client (needs GraphQL server up)                                                                                                               |
| `npm run start:grpc-server`               | gRPC `CustomerService` → **127.0.0.1:30043**                                                                                                                  |
| `npm run start:grpc-client`               | Express + gRPC client → **[http://localhost:3000](http://localhost:3000)**                                                                                    |
| `npm run start:short-polling`             | Short-polling demo → **[http://localhost:3000](http://localhost:3000)** (see folder README)                                                                   |
| `npm run start:long-polling`              | Long-polling demo → **[http://localhost:3000](http://localhost:3000)** (see folder README)                                                                    |
| `npm run start:websocket`                 | Socket.IO chat demo → **[http://localhost:3000](http://localhost:3000)** (see folder README)                                                                  |
| `npm run start:sse`                       | Server-Sent Events demo → **[http://localhost:3000](http://localhost:3000)** (see folder README)                                                              |
| `npm run start:webhook`                   | Webhook receiver demo → **[http://localhost:3000](http://localhost:3000)** (see folder README)                                                                |
| `npm run start:server-side-mitigation`    | CSP demo → **[http://localhost:3000](http://localhost:3000)** (see `[01_xss` README](src/03-security/01_xss/README.md))                                       |
| `npm run start:iframe-protection-server1` | Parent / embedder pages → **[http://localhost:3000](http://localhost:3000)** (see [iframe protection README](src/03-security/02_iframe-protection/README.md)) |
| `npm run start:iframe-protection-server2` | Framed origin (`frame-ancestors`) → **[http://localhost:3001](http://localhost:3001)** (same README)                                                          |
| `npm run start:security-headers`          | Security headers demo → **[http://localhost:3000](http://localhost:3000)** (see [security headers README](src/03-security/03_security-headers/README.md))     |
| `npm run start:permissions-policy`        | Permissions-Policy (geolocation off) → **[http://localhost:3000](http://localhost:3000)** (see [Permissions Policy README](src/03-security/04_permissions-policy/README.md)) |

Each chapter’s **README** has API details and a file map.

## Linting and test

| Script           | What it runs                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run lint`   | `biome check`                                                                                            |
| `npm run format` | `biome format --write`                                                                                   |
| `npm test`       | `node --test test/scripts.test.mjs` — runs `lint` and `format`, then smoke-checks every `start:…` script |

## Dependencies

Install from the root `[package.json](package.json)`. Chapter READMEs list packages used per example.

| Packages                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@apollo/server`, `@biomejs/biome`, `@grpc/grpc-js`, `@grpc/proto-loader`, `@types/uuid`, `body-parser`, `express`, `graphql`, `socket.io`, `uuid`, `nodemon` |
