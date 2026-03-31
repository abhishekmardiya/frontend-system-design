import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Holds the latest data available on the server
let data = "message-1";

const waitingClients = [];

app.get("/", (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Long-poll: client sends the value it already has (`lastData`). If the server has something newer,
// reply right away. If nothing changed yet, keep the HTTP request open and queue `res` until
// `/updateData` pushes new data (or the client gives up / times out on the browser side).
app.get("/getData", (req, res) => {
  if (data !== req.query.lastData) {
    res.json({ data });
  } else {
    waitingClients.push(res);
  }
});

// Simulates “something changed on the server” (new message, notification, etc.).
app.post("/updateData", (req, res) => {
  data = req.body.data;

  // Everyone who was still waiting on /getData (same lastData) gets a response now instead of timing out.
  while (waitingClients.length > 0) {
    const client = waitingClients.pop();
    client.json({ data });
  }

  res.send({ success: "Data updated successfully" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
