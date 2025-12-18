const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../auth");

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

// ------------------- REGISTER -------------------
router.post("/register", upload.single("profile_image"), async (req, res) => {
  try {
    const { name, email, password, city_code } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    await pool.query(
      "INSERT INTO users (name,email,password,city_code,role,profile_image) VALUES ($1,$2,$3,$4,'passenger',$5)",
      [name, email, hash, city_code, profileImage]
    );

    res.json({ message: "Passenger registered", profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='passenger'",
      [email]
    );
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
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ------------------- CREATE RIDE -------------------
router.post("/create-ride", authenticateToken, async (req, res) => {
  try {
    const { pickup_city, destination_city, seats, date_time } = req.body;
    const passenger_id = req.user.id;

    await pool.query(
      `INSERT INTO rides (passenger_id,pickup_city,destination_city,seats,status,date_time)
       VALUES ($1,$2,$3,$4,'AVAILABLE',$5)`,
      [passenger_id, pickup_city, destination_city, seats, date_time]
    );

    res.json({ message: "Ride created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create ride" });
  }
});

// ------------------- GET AVAILABLE RIDES -------------------
router.get("/rides", authenticateToken, async (req, res) => {
  try {
    const { pickup, destination } = req.query;

    // Only rides with seats > 0 and status AVAILABLE
    const rides = await pool.query(
      `SELECT * FROM rides 
       WHERE pickup_city=$1 AND destination_city=$2 AND status='AVAILABLE' AND seats > 0`,
      [pickup, destination]
    );

    res.json(rides.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});

// ------------------- GET RIDES ACCEPTED BY DRIVERS -------------------
router.get("/accepted-rides", authenticateToken, async (req, res) => {
  try {
    const rides = await pool.query(
      `SELECT r.*, u.name as driver_name, u.vehicle_type, u.vehicle_number, u.vehicle_image
       FROM rides r
       JOIN users u ON r.driver_id = u.id
       WHERE r.driver_id IS NOT NULL`
    );

    res.json(rides.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch accepted rides" });
  }
});

// ------------------- JOIN RIDE -------------------
router.post("/join-ride", authenticateToken, async (req, res) => {
  try {
    const { ride_id } = req.body;
    const passenger_id = req.user.id;

    // Check if seats are available
    const ride = await pool.query("SELECT seats FROM rides WHERE id=$1", [ride_id]);
    if (ride.rows.length === 0) return res.status(404).json({ message: "Ride not found" });
    if (ride.rows[0].seats <= 0) return res.status(400).json({ message: "No seats available" });

    await pool.query(
      "INSERT INTO ride_members (ride_id,passenger_id) VALUES ($1,$2)",
      [ride_id, passenger_id]
    );
    await pool.query("UPDATE rides SET seats = seats - 1 WHERE id=$1", [ride_id]);

    res.json({ message: "Joined ride" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join ride" });
  }
});

// ------------------- RATE DRIVER -------------------
router.post("/rate-driver", authenticateToken, async (req, res) => {
  try {
    const { driver_id, ride_id, rating, review } = req.body;
    const passenger_id = req.user.id;

    await pool.query(
      `INSERT INTO reviews (driver_id,passenger_id,ride_id,rating,review)
       VALUES ($1,$2,$3,$4,$5)`,
      [driver_id, passenger_id, ride_id, rating, review]
    );

    res.json({ message: "Review submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

// ------------------- UPDATE PROFILE IMAGE -------------------
router.put("/update-profile-image", authenticateToken, upload.single("profile_image"), async (req, res) => {
  try {
    const passenger_id = req.user.id;
    const profileImage = req.file ? req.file.filename : null;
    if (!profileImage) return res.status(400).json({ message: "No image uploaded" });

    await pool.query("UPDATE users SET profile_image=$1 WHERE id=$2", [profileImage, passenger_id]);
    res.json({ message: "Profile image updated", profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile image" });
  }
});

module.exports = router;
