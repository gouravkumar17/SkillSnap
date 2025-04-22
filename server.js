require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();
const allowedOrigins = [
  'http://localhost:3000',
  'https://zesty-choux-a9d5f3.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/applications", applicationRoutes);

// 404 Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    error: "NotFoundError",
    status: 404,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = err.status || 500; // Default to 500 if status is not set
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    error: {
      message: message,
      // Optionally, send error stack in development for debugging purposes
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
