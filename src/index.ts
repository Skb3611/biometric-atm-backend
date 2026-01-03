import express from "express";
import router from "./routes";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:8080", // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-account-number",
      "fingerprintId",
    ],
  })
);
app.use(express.json());
app.use(router);
app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
