# Agent guidelines

Conventions for this repo when adding or editing examples:

- When a **new concept** or topic is added under `src/` (or similar), add a matching row to the **Concepts** table in the root **[README.md](README.md)** so the catalog stays in sync with the repo.
- Each npm-backed folder should include a **README.md** (install, scripts, ports).
- Each **package.json** should use `"type": "module"`, a kebab-case **`name`** matching the folder name without the numeric chapter prefix, **`nodemon`** in `devDependencies`, and scripts that use **`start`** with `node` and **`dev`** with `nodemon` (or **`dev:server`** / **`dev:client`** when there are two entrypoints).
