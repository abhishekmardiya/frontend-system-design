import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Static assets: path from this file so `npm run` from repo root still resolves `public/`.
app.use(express.static(join(__dirname, "public")));

// Define your routes
app.get("/example1", (_req, res) => {
  res.sendFile(join(__dirname, "public", "example1.html"));
});

app.get("/example2", (_req, res) => {
  res.sendFile(join(__dirname, "public", "example2.html"));
});

app.get("/example3", (_req, res) => {
  res.sendFile(join(__dirname, "public", "example3.html"));
});

const PORT = 5010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
