import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

let data = "Initial Data";

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getData", (_req, res) => {
  res.send({
    data: `${data} ${Date.now()}`,
  });
});

// Use post/put to update
app.get("/updateData", (_req, res) => {
  data = "Updated Data";
  res.send({
    data,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
