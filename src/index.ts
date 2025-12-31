import express from "express";
import router from "./routes";
const app = express();
app.use(express.json());
app.use(router);

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
