import app from "./src/app";
import { connectDB } from "./src/db/db";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection failed:", error);
  });
