# GraphQL

**Apollo Server 4** with a standalone HTTP server: one **GraphQL** endpoint (POST with JSON body) instead of many REST paths. Schema in `server/typeDefs.js`, logic in `server/resolvers.js`, seed data in `server/data.js`. A small **fetch** script under `client/fetch/` shows how a Node client calls the same endpoint.

## Prerequisites

- Node.js

## Install

From the **repository root**:

```bash
npm install
```

The demo client under `client/fetch/` uses built-in `fetch` (Node 18+).

## Run GraphQL server

From the **repository root**:

```bash
npm run start:graphql
```

Server prints **`http://localhost:4000/`** (Apollo standalone — use this URL as the GraphQL HTTP endpoint).

## Run example client (optional)

With the server already running, from the **repository root**:

```bash
npm run start:graphql-fetch
```

That script sends a **query** (`GetData`) and a **mutation** (`AddBook`) to `http://localhost:4000`.

## npm scripts (root `package.json`)

| Script                | Role                   |
| --------------------- | ---------------------- |
| `start:graphql`       | Run the GraphQL server |
| `start:graphql-fetch` | Example `fetch` client |

## Schema (summary)

- **Query:** `authors`, `books` — lists with optional relations (`Author.books`, `Book.author`).
- **Mutation:** `addBook(title, publishedYear, authorId)` — appends a book in memory.

See `server/typeDefs.js` for the full SDL and `server/resolvers.js` for field resolvers.

## Files

| Path                    | Role                                                     |
| ----------------------- | -------------------------------------------------------- |
| `server/index.js`       | Apollo Server + `startStandaloneServer` on port **4000** |
| `server/typeDefs.js`    | GraphQL schema string                                    |
| `server/resolvers.js`   | Query / mutation / type resolvers                        |
| `server/data.js`        | In-memory authors & books                                |
| `client/fetch/index.js` | Example `fetch` calls (query + mutation)                 |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                    |
| --------------------------- |
| `@apollo/server`, `graphql` |

`client/fetch/` uses Node’s built-in `fetch` (Node 18+).
