// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
// import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
await connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRouter);
// app.use("/admin", adminRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
