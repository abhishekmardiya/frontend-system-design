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

| Topic                           | Code                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------ |
| **Cross-Site Scripting (XSS)**  | `[01_xss](src/03-security/01_xss)`                                             |
| **Iframe protection**           | `[02_iframe-protection](src/03-security/02_iframe-protection)`                 |
| **Security headers**            | `[03_security-headers](src/03-security/03_security-headers)`                   |
| **Permissions Policy**          | `[04_permissions-policy](src/03-security/04_permissions-policy)`               |
| **Subresource integrity (SRI)** | `[05_subresource_integrity_sri](src/03-security/05_subresource_integrity_sri)` |
| **CORS**                        | `[06_cors](src/03-security/06_cors)`                                           |
| **CSRF**                        | `[07_csrf](src/03-security/07_csrf)`                                           |

### [Testing](src/04-testing)

| Topic          | Code                           |
| -------------- | ------------------------------ |
| **Unit tests** | `[04-testing](src/04-testing)` |

## Setup

**Each runnable example under `src/` has its own `package.json`.** There is no root manifest. From an example folder:

```bash
cd src/01-networking/01_rest-api
npm install
```

**Modules use ESM:** each folder’s manifest sets `"type": "module"`, so `.js` files are treated as ES modules.

**Paths to files on disk** — when you run `npm start`, the current working directory is usually that **example folder**. Still prefer building absolute paths with **`node:path`** and **`import.meta.url`** (via `fileURLToPath`) for proto files, static assets, and anything read by path string so resolution does not depend on where Node was started.

## Run examples

From each example folder after `npm install`. All **`start`** scripts use **[nodemon](https://nodemon.io/)** and watch only that folder.

| Folder                                  | Command                 | What it runs                                                                                                                                                                                                       |
| --------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/01-networking/01_rest-api`         | `npm start`             | REST todos API → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                                |
| `src/01-networking/02_graphql`          | `npm start`             | Apollo GraphQL → **[http://localhost:4000](http://localhost:4000)**                                                                                                                                                |
| `src/01-networking/02_graphql`          | `npm run start:fetch`   | Sample `fetch` client (needs GraphQL server up)                                                                                                                                                                    |
| `src/01-networking/03_grpc`             | `npm run start:server`  | gRPC `CustomerService` → **127.0.0.1:30043**                                                                                                                                                                       |
| `src/01-networking/03_grpc`             | `npm run start:client`  | Express + gRPC client → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                         |
| `src/02-communication/01_short-polling` | `npm start`             | Short-polling demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                            |
| `src/02-communication/02_long-polling`  | `npm start`             | Long-polling demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                             |
| `src/02-communication/03_websocket`     | `npm start`             | Socket.IO chat demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                           |
| `src/02-communication/04_sse`           | `npm start`             | Server-Sent Events demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                       |
| `src/02-communication/05_webhook`       | `npm start`             | Webhook receiver demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                         |
| `src/03-security/01_xss`                | `npm start`             | CSP demo → **[http://localhost:3000](http://localhost:3000)** (see [XSS README](src/03-security/01_xss/README.md))                                                                                                 |
| `src/03-security/02_iframe-protection`  | `npm run start:server1` | Parent / embedder pages → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                       |
| `src/03-security/02_iframe-protection`  | `npm run start:server2` | Framed origin → **[http://localhost:3001](http://localhost:3001)** (see [iframe protection README](src/03-security/02_iframe-protection/README.md))                                                                |
| `src/03-security/03_security-headers`   | `npm start`             | Security headers demo → **[http://localhost:3000](http://localhost:3000)**                                                                                                                                         |
| `src/03-security/04_permissions-policy` | `npm start`             | Permissions-Policy (geolocation off) → **[http://localhost:3000](http://localhost:3000)**                                                                                                                          |
| `src/03-security/06_cors`               | `npm start`             | CORS sample API → **[http://localhost:3000](http://localhost:3000)** (open [`client/index.html`](src/03-security/06_cors/client/index.html) via Live Server; see [CORS README](src/03-security/06_cors/README.md)) |
| `src/04-testing`                        | `npm test`              | Jest unit tests for `app.js`                                                                                                                                                                                       |

**CSRF** vulnerability demos are static HTML only: open [`vulnerability/example1.html`](src/03-security/07_csrf/vulnerability/example1.html) and [`vulnerability/example2.html`](src/03-security/07_csrf/vulnerability/example2.html) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (or any static file server). Mitigation samples under [`mitigation/`](src/03-security/07_csrf/mitigation/) are teaching references; see [CSRF README](src/03-security/07_csrf/README.md).

**Subresource integrity (SRI)** is a static page only: open [`src/03-security/05_subresource_integrity_sri/index.html`](src/03-security/05_subresource_integrity_sri/index.html) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (or any static file server). See [SRI README](src/03-security/05_subresource_integrity_sri/README.md).

Each chapter’s **README** has API details and a file map.

## Linting and test

From the [`test/`](test/) folder:

```bash
cd test
npm install
npm test
```

| Script           | What it runs                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `npm run lint`   | `biome check ..` (repo-wide, config in root [`biome.json`](biome.json))                        |
| `npm run format` | `biome format --write ..`                                                                      |
| `npm test`       | `node --test scripts.test.mjs` — runs `lint` and `format`, then smoke-checks runnable examples |

## Dependencies

Install per example folder (`npm install` in that folder). Chapter READMEs list packages used in each example. Repo-wide lint tooling lives in [`test/package.json`](test/package.json).
