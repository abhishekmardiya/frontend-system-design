import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serves static HTML that loads lodash from a CDN with integrity + crossorigin
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
