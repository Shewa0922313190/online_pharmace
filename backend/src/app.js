import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// SQL connection file
import router from "./routes/index.js"; // Import routes

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;
console.log("🚀 Starting server on port:", port);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,               // Allow cookies/headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// In ES modules, you typically don't export the app like in CommonJS.
// If you need to export it for testing or other purposes, you can do so:
export default app;
