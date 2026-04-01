# Agent guidelines

## Docs and catalog

- New topic under `src/` → add a **Concepts** row in the root **[README.md](README.md)**.
- Root **README** owns project intent (three bullets under H1), **Setup**, **Run examples**, and **Concepts**. Keep its script table aligned with root **[package.json](package.json)** `scripts`.
- Each `src/…` example **README**: **H1** is a short topic title only (**REST API**, **GraphQL**, **gRPC**, **Short polling**—no numeric folder prefixes); **`npm run …`** from repo root, ports, file map.
- Chapter READMEs **must not** duplicate **[README.md](README.md)** **Setup** (ESM, single root `package.json`, resolving paths with `import.meta.url` and `node:path`). Document that only in the root README.
- End with **Dependencies**: link to root [package.json](package.json) (correct relative path, e.g. `../../../package.json`). One **Packages** table, one row, comma-separated imports; if stubbed, say so and update when you add deps.

## Root `package.json` only

- All **dependencies** and **scripts** live at the repo root—no `package.json` under `src/`. ESM by default (`"type": "module"`).
- Runnable examples: `npm run start:…` from root (uses **nodemon**; per-script watch paths in [`package.json`](package.json)). **lint** / **format** stay root-only.

## Paths

- ESM `import` paths are relative to the file—fine.
- String paths resolved from **`process.cwd()`** (e.g. proto loaders, `readFileSync`) break when cwd is the repo root. Build paths from **`import.meta.url`** + **`fileURLToPath`** + **`node:path`** (see gRPC).

## Comments

- **`src/…` examples are teaching aids:** add short comments.
- **Do not** restate what the next line obviously does, or add long docblocks on trivial code. Prefer **one line** over a paragraph when a single phrase suffices.

## Before you finish

- README script table ↔ `package.json` scripts; new topic ↔ Concepts row; chapter README: `npm run`, ports, Dependencies match imports; no duplicated **Setup** block in `src/…` READMEs.
- After changing scripts or entrypoints: **`npm test`**.
