import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = join(__dirname, "public", "index.html");

const PORT = 3010;
const app = express();

/* Rules for Using a CSP Nonce
- The nonce must be `unique` for every HTTP response
- It should be generated using a `cryptographically secure` random generator
- Ensure sufficient length — `at least 128 bits of entropy`
(≈ 32 hex characters or ~24 base64 characters)
- <script> tags using a nonce must `not include any untrusted or unescaped data`
- The nonce value should `only contain valid base64` characters
*/

// Set the CSP header
app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy", // CSP header
    // default-src 'self'
    // → By default, only allow resources from the same origin

    // script-src
    // → Allow scripts from:
    //    - same origin ('self')
    //    - http://unsecure.com
    //    - inline scripts ONLY if they have the matching nonce
    // Note:
    //    - 'unsafe-inline' is ignored when a nonce or hash is present

    // img-src
    // → Allow images from:
    //    - same origin
    //    - https://images.pexels.com

    "default-src 'self'; " +
      "script-src 'self' 'nonce-randomKey' http://unsecure.com; " +
      "img-src 'self' https://images.pexels.com/;",
  );

  next();
});

// Serve the HTML page
app.get("/", (req, res) => {
  console.log(req.url);
  res.sendFile(indexHtmlPath);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
