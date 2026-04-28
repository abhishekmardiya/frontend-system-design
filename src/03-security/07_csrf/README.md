# CSRF

Cross-site request forgery: the browser sends a request (often a form POST) that the target site treats as authenticated because the victim is already logged in.

**Vulnerability:** Open [`vulnerability/example1.html`](vulnerability/example1.html) (email-style markup) and [`vulnerability/example2.html`](vulnerability/example2.html) (POST to a third-party origin) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any static file server. There is no `npm run` script for these static demos.

**Mitigation samples:** [`mitigation/referer.js`](mitigation/referer.js) illustrates validating the `Referer` header; [`mitigation/anti-crsf.js`](mitigation/anti-crsf.js) illustrates a session-stored CSRF token in a form. They are teaching references and are not wired as runnable ESM entry points from the repo root.

## Files

| Path                            | Role                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| `vulnerability/example1.html`   | Email-style HTML template (CSRF context in comments / structure)          |
| `vulnerability/example2.html`   | Simple POST form pointing at a third-party bank URL (attack illustration) |
| `mitigation/referer.js`         | Express middleware sketch: allow requests whose `Referer` matches your site |
| `mitigation/anti-crsf.js`       | Express sketch: CSRF token in session + hidden form field                   |

## Dependencies

Root [`package.json`](../../../package.json).

| Packages                                    |
| ------------------------------------------- |
| `express`, `body-parser`, `express-session` |
