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

io.on("connection", (socket) => {
  console.log("Connection established");

  socket.on("chat message", (msg) => {
    console.log("received message", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
