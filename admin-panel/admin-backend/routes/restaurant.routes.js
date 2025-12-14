import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import Owner from "../models/owners.js";
import Dish from "../models/dish.js";

const router = express.Router();

/* ------------------------------------------------
   1️⃣ LIST RESTAURANTS (SEARCH + PAGINATION)
------------------------------------------------ */
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { email: regex },
        { restaurantName: regex },
        { ownerName: regex },
        { username: regex },           // added this
        { phone: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Owner.countDocuments(query);

    const restaurants = await Owner.find(query)
      .select(
        "email restaurantName ownerName username phone city state createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.json({
      success: true,
      restaurants,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: skip + restaurants.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Admin restaurant fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
});

/* ------------------------------------------------
   2️⃣ GET MENU USING USERNAME
   /api/admin/restaurants/menu?username=logoq
------------------------------------------------ */
router.get("/menu", adminAuth, async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // find restaurant by username
    const owner = await Owner.findOne({ username }).lean();

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found with this username",
      });
    }

    // load dishes using username
    const dishes = await Dish.find({ username }).lean();

    return res.json({
      success: true,
      restaurant: owner,
      dishes,
    });
  } catch (err) {
    console.error("Menu load error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load menu",
    });
  }
});

export default router;
