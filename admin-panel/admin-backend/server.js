import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs; 


import Admin from "./models/admin.js";

import adminRoutes from "./routes/admin.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import dishRoutes from "./routes/dish.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

// Debug database
console.log("ADMIN_DB_URL =", process.env.ADMIN_DB_URL);


/* ==========================================================
   CONNECT DB + CREATE SUPER ADMIN SAFELY
========================================================== */
mongoose
  .connect(process.env.ADMIN_DB_URL)
  .then(async () => {
    console.log("Admin DB Connected");

    // ---- CREATE SUPER ADMIN (One-time reset) ---- //
   
  })
  .catch((err) => console.error("DB Error:", err));

console.log("DB URL = ", process.env.ADMIN_DB_URL);


// Debug R2
console.log("R2 DEBUG:", {
  ACCESS_KEY: process.env.R2_ACCESS_KEY ? "LOADED" : "MISSING",
  SECRET_KEY: process.env.R2_SECRET_KEY ? "LOADED" : "MISSING",
  ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  BUCKET: process.env.R2_BUCKET,
  PUBLIC_URL: process.env.R2_PUBLIC_URL,
});


/* ==========================================================
   SUPER ADMIN INITIALIZER
========================================================== */








/* ==========================================================
   ROUTES
========================================================== */

app.use("/api/admin", adminRoutes);
app.use("/api/admin/restaurants", restaurantRoutes);
app.use("/api/admin", dishRoutes);

app.listen(6001, () =>
  console.log("Admin backend running on port 6001")
);
