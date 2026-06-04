import express, { type Application } from "express";
import { connectDB } from "./src/db/db";

const app: Application = express();
const port = process.env.PORT || 3000;

app.get("/health-check", (req, res) => {
  res.send("Server is running fine");
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection failed:", error);
  });
