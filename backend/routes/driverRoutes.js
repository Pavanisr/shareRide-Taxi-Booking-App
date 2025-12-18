// routes/driverRoutes.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../auth"); // JWT auth middleware

const router = express.Router();

// ------------------- MULTER SETUP -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ------------------- DRIVER ROLE CHECK MIDDLEWARE -------------------
const authorizeDriver = async (req, res, next) => {
  try {
    const user = await pool.query("SELECT role FROM users WHERE id=$1", [req.user.id]);
    if (!user.rows.length || user.rows[0].role !== "driver") {
      return res.status(403).json({ message: "Access denied. Only drivers allowed." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Authorization failed" });
  }
};

// ------------------- REGISTER DRIVER -------------------
router.post(
  "/register",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "vehicle_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, city_code, vehicle_type, vehicle_number } = req.body;
      const hash = await bcrypt.hash(password, 10);

      const profileImage = req.files["profile_image"] ? req.files["profile_image"][0].filename : null;
      const vehicleImage = req.files["vehicle_image"] ? req.files["vehicle_image"][0].filename : null;

      await pool.query(
        `INSERT INTO users 
          (name, email, password, city_code, role, profile_image, vehicle_image, vehicle_type, vehicle_number)
         VALUES ($1,$2,$3,$4,'driver',$5,$6,$7,$8)`,
        [name, email, hash, city_code, profileImage, vehicleImage, vehicle_type, vehicle_number]
      );

      res.json({ message: "Driver registered", profileImage, vehicleImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Driver registration failed" });
    }
  }
);

// ------------------- LOGIN DRIVER -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1 AND role='driver'", [email]);
    if (user.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.rows[0].password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        city_code: user.rows[0].city_code,
        profileImage: user.rows[0].profile_image,
        vehicleImage: user.rows[0].vehicle_image,
        vehicleType: user.rows[0].vehicle_type,
        vehicleNumber: user.rows[0].vehicle_number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ------------------- GET AVAILABLE RIDES -------------------
router.get("/available-rides", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const user = await pool.query("SELECT city_code FROM users WHERE id=$1", [req.user.id]);
    const city = user.rows[0].city_code;

    const rides = await pool.query(
      "SELECT * FROM rides WHERE pickup_city=$1 AND driver_id IS NULL AND status='AVAILABLE'",
      [city]
    );

    res.json(rides.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});

// ------------------- ACCEPT RIDE -------------------
router.post("/accept-ride", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver_id = req.user.id;
    const { ride_id } = req.body;

    await pool.query("UPDATE rides SET driver_id=$1, status='ACCEPTED' WHERE id=$2", [driver_id, ride_id]);

    res.json({ message: "Ride accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept ride" });
  }
});

// ------------------- UPDATE RIDE STATUS -------------------
router.post("/ride-status", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const { ride_id, status } = req.body;

    await pool.query("UPDATE rides SET status=$1 WHERE id=$2", [status, ride_id]);

    res.json({ message: "Ride status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ride status" });
  }
});

// ------------------- GET DRIVER REVIEWS -------------------
router.get("/reviews", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver_id = req.user.id;
    const reviews = await pool.query("SELECT * FROM reviews WHERE driver_id=$1", [driver_id]);

    res.json(reviews.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// ------------------- UPDATE PROFILE IMAGE -------------------
router.put("/update-profile-image", authenticateToken, authorizeDriver, upload.single("profile_image"), async (req, res) => {
  try {
    const driver_id = req.user.id;
    const profileImage = req.file ? req.file.filename : null;

    if (!profileImage) return res.status(400).json({ message: "No image uploaded" });

    await pool.query("UPDATE users SET profile_image=$1 WHERE id=$2", [profileImage, driver_id]);

    res.json({ message: "Profile image updated", profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile image" });
  }
});

// ------------------- UPDATE VEHICLE IMAGE -------------------
router.put("/update-vehicle-image", authenticateToken, authorizeDriver, upload.single("vehicle_image"), async (req, res) => {
  try {
    const driver_id = req.user.id;
    const vehicleImage = req.file ? req.file.filename : null;

    if (!vehicleImage) return res.status(400).json({ message: "No image uploaded" });

    await pool.query("UPDATE users SET vehicle_image=$1 WHERE id=$2", [vehicleImage, driver_id]);

    res.json({ message: "Vehicle image updated", vehicleImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vehicle image" });
  }
});

module.exports = router;
