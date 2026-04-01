import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.get("/sse", (req, res) => {
  // SSE framing: browsers expect this MIME type to treat the response as an event stream.
  res.setHeader("Content-Type", "text/event-stream");
  // Avoid intermediaries caching partial stream data; keep the TCP connection open for pushes.
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Wire format: each event is one or more `data:` lines, then a blank line (`\n\n`) to flush the event.
  res.write("data: Welcome to Server sent event \n\n");

  const intervalId = setInterval(() => {
    res.write(`data: Server Time ${new Date().toLocaleDateString()} \n\n`);
  }, 5000);

  // When the client closes the tab or navigates away, stop the interval so the handler does not leak.
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
