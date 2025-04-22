require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

// ✅ Ensure full origins (including https)
const allowedOrigins = [
  'http://localhost:3000',
  'https://roleq-jobtracker.netlify.app/'
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
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

// ✅ Place this BEFORE any routes/middleware
app.use(cors(corsOptions));

// ✅ Also respond to preflight OPTIONS requests directly
app.options("*", cors(corsOptions));

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    error: "NotFoundError",
    status: 404,
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    error: {
      message: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    },
  });
});

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
