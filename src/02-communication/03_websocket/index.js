import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (_req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Fires once per browser tab (or client) when the WebSocket handshake completes.
io.on("connection", (socket) => {
  console.log("Connection established");

  // Client sent a "chat message" event; rebroadcast to every connected socket (simple chat room).
  socket.on("chat message", (msg) => {
    console.log("received message", msg);
    io.emit("chat message", msg);
  });

  // Socket.IO cleans up the socket; use this for logging or per-user teardown.
  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
