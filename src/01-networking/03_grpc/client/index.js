import bodyParser from "body-parser";
import express from "express";

const app = express();

// bodyParser.json() parses JSON request body, while bodyParser urlencoded({ extended: true }) parses form data (key=value format).
// In short: json() for APIs, urlencoded() for HTML form data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
