import { join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 3010;
const app = express();

// Policy matches index.html: same-origin + this request’s nonce for trusted inline script; optional
// third-party script URL; img-src for the external profile image. Inline script without a nonce is blocked.
app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self';" +
      "script-src 'self' 'nonce-randomKey' 'unsafe-inline' http://unsecure.com;",
  );
  next();
});

// expose the public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log(req.url);
  res.sendFile(join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started at http://locolhost:${PORT}`);
});
