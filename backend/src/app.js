import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.use((req, res, next) => {  //debugging middleware
//   console.log("HIT:", req.method, req.url);
//   next();
// });

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import collegeRoutes from "./routes/college.routes.js";


// Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/password", passwordRoutes);
app.use("/api/v1/colleges", collegeRoutes);


// Error handling middleware
app.use(errorHandler);

export { app };