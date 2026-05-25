import express from "express";

const app = express();

const data = "Initial Data";

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: process.cwd() });
});

app.get("/getData", (_req, res) => {
  res.send({
    // Add a timestamp to demonstrate dynamic updates on each poll request
    data: `${data} ${Date.now()}`,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
