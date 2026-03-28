# Agent guidelines

## Docs and catalog

- New topic under `src/` → add a **Concepts** row in the root **[README.md](README.md)**.
- Root **README** owns project intent (three bullets under H1), **Setup**, **Run examples**, and **Concepts**. Keep its script table aligned with root **[package.json](package.json)** `scripts`.
- Each `src/…` example **README**: **H1** is a short topic title only (**REST API**, **GraphQL**, **gRPC**, **Short polling**—no numeric folder prefixes); describe the demo, **`npm run …`** from repo root, ports, file map; link to root **Setup** for ESM / single manifest / `node:path` (do not repeat).
- End with **Dependencies**: link to root [package.json](package.json) (correct relative path, e.g. `../../../package.json`). One **Packages** table, one row, comma-separated imports; if stubbed, say so and update when you add deps.

## Root `package.json` only

- All **dependencies** and **scripts** live at the repo root—no `package.json` under `src/`. ESM by default (`"type": "module"`).
- Runnable examples: `node src/…/entry.js` from root, consistent names (`start:…`, `grpc:…`). **lint** / **format** stay root-only.

## Paths

- ESM `import` paths are relative to the file—fine.
- String paths resolved from **`process.cwd()`** (e.g. proto loaders, `readFileSync`) break when cwd is the repo root. Build paths from **`import.meta.url`** + **`fileURLToPath`** + **`node:path`** (see gRPC).

## Before you finish

- README script table ↔ `package.json` scripts; new topic ↔ Concepts row; chapter README: `npm run`, ports, Dependencies match imports.
- After changing scripts or entrypoints: **`npm test`**.
