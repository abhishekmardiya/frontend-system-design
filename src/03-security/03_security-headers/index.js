import express from "express";

const app = express();

// for Strict-Transport-Security (HSTS)
const redirectToHttps = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    // Redirect to HTTPS
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  next();
};

app.use(redirectToHttps);

app.use((_req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  next();
});

app.get("/list", (_req, res) => {
  res.send([
    {
      id: 1,
      title: "Javascript is awesome",
    },
  ]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Referrer-Policy: no-referrer :
Stops the browser from sending the current page’s URL (or full URL) as the Referer on navigations and subresource requests. Cuts down on leaking paths, query strings, or tokens to other sites.

X-Powered-By removed :
Express adds this by default (e.g. Express). Removing it avoids advertising the stack to scanners; it’s not a security boundary by itself, just less noise.

X-Content-Type-Options: nosniff :
Tells browsers not to “guess” MIME types from content. Responses are interpreted only as the declared Content-Type, which reduces some drive-by issues (e.g. treating a file as executable script when it shouldn’t be).

Strict-Transport-Security (HSTS) :
Tells browsers: “only use HTTPS for this host for a long time (max-age), including subdomains (includeSubDomains), and you may include this site in the browser preload list (preload).” After the first HTTPS visit, future visits should go straight over HTTPS and avoid accidental HTTP.
Note: On plain http://localhost during dev, browsers may still store or apply this in limited ways; it matters most on real HTTPS deployments.
*/
