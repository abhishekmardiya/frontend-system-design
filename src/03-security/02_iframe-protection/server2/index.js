import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use((_req, res, next) => {
  // Clickjacking mitigation: uncomment the next line to forbid embedding (CSP frame-ancestors 'none').
  // Leave it commented so the parent app on :3000 can iframe these pages for the demos.
  // res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");

  res.cookie("sessionID", "12345", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  next();
});

app.use(express.static(join(__dirname, "public")));

// Define your routes
app.get("/iframe-website1", (_req, res) => {
  res.sendFile(join(__dirname, "public", "iframe-website1.html"));
});

app.get("/iframe-website2", (_req, res) => {
  res.sendFile(join(__dirname, "public", "iframe-website2.html"));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Files in public/ are served at http://localhost:${PORT}/iframe-website1, /iframe-website2 (and other static paths).`,
  );
});
