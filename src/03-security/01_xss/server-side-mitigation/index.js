import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const indexTemplate = readFileSync(
  path.join(__dirname, "public", "index.html"),
  "utf8",
);

const app = express();

// Policy matches index.html: same-origin + this request’s nonce for trusted inline script; optional
// third-party script URL; img-src for the external profile image. Inline script without a nonce is blocked.
app.get("/", (_req, res) => {
  const nonce = randomBytes(16).toString("base64");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' http://unsecure.com`,
      "img-src 'self' https://media.licdn.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  );
  res.type("html").send(indexTemplate.replaceAll("%NONCE%", nonce));
});

const port = 3010;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
