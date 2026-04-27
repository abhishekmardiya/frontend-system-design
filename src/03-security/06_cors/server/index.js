import cors from "cors";
import express from "express";

const app = express();

const allowedOrigin = ["http://127.0.0.1:5500"];

const corsOptions = {
  origin: (origin, callback) => {
    // if the origin is in the allowedOrigin array or is not provided, allow the request
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS error"));
    }
  },
};

app.use(cors(corsOptions));

app.get("/list", (_req, res) => {
  res.json([
    {
      id: 1,
      title: "Namaste Frontend System Design",
    },
  ]);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
