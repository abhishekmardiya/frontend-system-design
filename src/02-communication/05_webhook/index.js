import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
  // Extract the payload from the incoming POST request
  const payload = req.body;

  // check for the signature
  const signature = req.headers["x-hub-signature"];
  // WEBHOOK_SECRET is the secret key for the webhook (WEBHOOK_SECRET is just for demo purposes)
  if (signature !== process.env.WEBHOOK_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  console.log("Received webhook payload:", payload);
  // send a response to the sender to acknowledge receipt
  res.status(200).send("Webhook received successfully");

  // do the work here (e.g. update the database, send a notification, etc.)
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
