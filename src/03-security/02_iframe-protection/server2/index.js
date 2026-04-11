import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");

  res.cookie("sessionID", "12345", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  next();
});

app.use(express.static(join(__dirname, "public")));

// Define your routes
app.get("/iframe-webiste1", (_req, res) => {
  res.sendFile(join(__dirname, "public", "iframe-webiste1.html"));
});

app.get("/iframe-webiste2", (_req, res) => {
  res.sendFile(join(__dirname, "public", "iframe-webiste2.html"));
});

const PORT = 5011;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
