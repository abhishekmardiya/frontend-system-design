# GraphQL

From the repository root:

- `npm run start:graphql` — Apollo at **http://localhost:4000/** (GraphQL HTTP endpoint).
- Optional: `npm run start:graphql-fetch` — sample query/mutation client (run with the server already up; uses Node’s built-in `fetch`).

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
