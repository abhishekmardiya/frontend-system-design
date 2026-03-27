# GraphQL demo (authors & books)

**Apollo Server 4** with a standalone HTTP server: one **GraphQL** endpoint (POST with JSON body) instead of many REST paths. Schema in `server/typeDefs.js`, logic in `server/resolvers.js`, seed data in `server/data.js`. A small **fetch** script under `client/fetch/` shows how a Node client calls the same endpoint.

## Prerequisites

- Node.js
- This package uses `"type": "module"` (ESM) in `server/`.

## Install (server)

From `src/01-networking/02_graphql/server`:

```bash
npm install
```

There is no separate `package.json` for the client script; it uses built-in `fetch` (Node 18+).

## Run GraphQL server

From **`02_graphql/server`**:

```bash
npm start
```

Or watch mode (restart on changes):

```bash
npm run dev
```

Server prints **`http://localhost:4000/`** (Apollo standalone — use this URL as the GraphQL HTTP endpoint). You can also run `nodemon index.js` directly.

## Run example client (optional)

With the server already running, from **`02_graphql`** (parent of `server` and `client`):

```bash
nodemon client/fetch/index.js
```

That script sends a **query** (`GetData`) and a **mutation** (`AddBook`) to `http://localhost:4000`.

## npm scripts (`server/package.json`)

| Script  | Command              | Role                       |
| ------- | -------------------- | -------------------------- |
| `start` | `nodemon ./index.js` | Run the server with reload |

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
