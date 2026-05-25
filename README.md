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

## Linting and test

From the [`test/`](test/) folder:

```bash
cd test
npm install
npm test
```

| Script                  | What it runs                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run lint`          | `biome check ..` (repo-wide, config in root [`biome.json`](biome.json))                            |
| `npm run format`        | `biome format --write ..`                                                                          |
| `npm run audit`         | `node audit.mjs` — runs `npm audit` in every folder under `src/` and `test/` with a `package.json` |
| `npm run audit:install` | same as `audit`, but runs `npm install` first in folders missing a lockfile                        |
| `npm test`              | `node --test scripts.test.mjs` — runs `lint` and `format`, then smoke-checks runnable examples     |

## Dependencies

Install per example folder (`npm install` in that folder). Chapter READMEs list packages used in each example. Repo-wide lint tooling lives in [`test/package.json`](test/package.json).
