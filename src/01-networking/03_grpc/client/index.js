import bodyParser from "body-parser";
import express from "express";
import client from "./client.js";

const app = express();

// bodyParser.json() parses JSON request body, while bodyParser urlencoded({ extended: true }) parses form data (key=value format).
// In short: json() for APIs, urlencoded() for HTML form data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  client.getAll(null, (err, data) => {
    if (!err) {
      res.send(data.customers);
    }
  });
});

app.post("/create", (req, res) => {
  const newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.insert(newCustomer, (err, data) => {
    if (err) throw err;

    console.log("Customer created successfully", data);
    res.send({ message: "Customer created successfully" });
  });
});

app.post("/update", (req, res) => {
  const updateCustomer = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.update(updateCustomer, (err, data) => {
    if (err) throw err;

    console.log("Customer updated successfully", data);
    res.send({ message: "Customer updated successfully" });
  });
});

app.post("/remove", (req, res) => {
  client.remove({ id: req.body.customer_id }, (err, _) => {
    if (err) throw err;

    console.log("Customer removed successfully");
    res.send({ message: "Customer removed successfully" });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
