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

// ------------------- LOGOUT -------------------
router.post("/logout", authenticateToken, authorizeDriver, async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ------------------- GET DRIVER PROFILE -------------------
router.get("/profile", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver_id = req.user.id;
    const user = await pool.query("SELECT * FROM users WHERE id=$1", [driver_id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ------------------- EDIT PROFILE -------------------
router.put("/edit-profile", authenticateToken, authorizeDriver, upload.single("profile_image"), async (req, res) => {
  try {
    const driver_id = req.user.id;
    const { name, city_code } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const query = [];
    const values = [];

    if (name) { query.push(`name=$${values.length + 1}`); values.push(name); }
    if (city_code) { query.push(`city_code=$${values.length + 1}`); values.push(city_code); }
    if (profileImage) { query.push(`profile_image=$${values.length + 1}`); values.push(profileImage); }

    if (!query.length) return res.status(400).json({ message: "Nothing to update" });

    values.push(driver_id);
    await pool.query(`UPDATE users SET ${query.join(", ")} WHERE id=$${values.length}`, values);

    res.json({ message: "Profile updated", profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ------------------- DELETE PROFILE -------------------
router.delete("/delete-profile", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver_id = req.user.id;

    await pool.query("DELETE FROM rides WHERE driver_id=$1", [driver_id]);
    await pool.query("DELETE FROM reviews WHERE driver_id=$1", [driver_id]);
    await pool.query("DELETE FROM users WHERE id=$1", [driver_id]);

    res.json({ message: "Driver profile deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete profile" });
  }
});

// ------------------- UPDATE VEHICLE -------------------
router.put("/vehicle", authenticateToken, authorizeDriver, upload.single("vehicle_image"), async (req, res) => {
  try {
    const driver_id = req.user.id;
    const { vehicle_type, vehicle_number } = req.body;
    const vehicleImage = req.file ? req.file.filename : null;

    const query = [];
    const values = [];

    if (vehicle_type) { query.push(`vehicle_type=$${values.length + 1}`); values.push(vehicle_type); }
    if (vehicle_number) { query.push(`vehicle_number=$${values.length + 1}`); values.push(vehicle_number); }
    if (vehicleImage) { query.push(`vehicle_image=$${values.length + 1}`); values.push(vehicleImage); }

    if (!query.length) return res.status(400).json({ message: "Nothing to update" });

    values.push(driver_id);
    await pool.query(`UPDATE users SET ${query.join(", ")} WHERE id=$${values.length}`, values);

    res.json({ message: "Vehicle updated", vehicleImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vehicle" });
  }
});

// ------------------- DELETE VEHICLE -------------------
router.delete("/vehicle", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver_id = req.user.id;
    await pool.query("UPDATE users SET vehicle_type=NULL, vehicle_number=NULL, vehicle_image=NULL WHERE id=$1", [driver_id]);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
});

// ------------------- GET AVAILABLE RIDES -------------------
router.get("/available-rides", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const driver = await pool.query("SELECT city_code FROM users WHERE id=$1", [req.user.id]);
    const city = driver.rows[0].city_code;

    const rides = await pool.query(
      "SELECT * FROM rides WHERE pickup_city=$1 AND driver_id IS NULL AND status='AVAILABLE' AND seats > 0",
      [city]
    );
    res.json(rides.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch available rides" });
  }
});

// ------------------- ACCEPT RIDE -------------------
router.post("/accept-ride", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const { ride_id } = req.body;
    const ride = await pool.query("SELECT status FROM rides WHERE id=$1", [ride_id]);
    if (!ride.rows.length) return res.status(404).json({ message: "Ride not found" });
    if (ride.rows[0].status !== "AVAILABLE") return res.status(400).json({ message: "Can only accept available rides" });

    await pool.query("UPDATE rides SET driver_id=$1, status='ACCEPTED' WHERE id=$2", [req.user.id, ride_id]);
    res.json({ message: "Ride accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept ride" });
  }
});

// ------------------- REJECT RIDE -------------------
router.post("/reject-ride", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const { ride_id } = req.body;
    const ride = await pool.query("SELECT status FROM rides WHERE id=$1 AND driver_id=$2", [ride_id, req.user.id]);
    if (!ride.rows.length) return res.status(404).json({ message: "Ride not found or not accepted" });
    if (ride.rows[0].status !== "ACCEPTED") return res.status(400).json({ message: "Can only reject accepted rides" });

    await pool.query("UPDATE rides SET driver_id=NULL, status='AVAILABLE' WHERE id=$1", [ride_id]);
    res.json({ message: "Ride rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject ride" });
  }
});

// ------------------- START RIDE -------------------
router.post("/start-ride", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const { ride_id } = req.body;
    const ride = await pool.query("SELECT status FROM rides WHERE id=$1 AND driver_id=$2", [ride_id, req.user.id]);
    if (!ride.rows.length) return res.status(404).json({ message: "Ride not found or not accepted" });
    if (ride.rows[0].status !== "ACCEPTED") return res.status(400).json({ message: "Can only start accepted rides" });

    await pool.query("UPDATE rides SET status='STARTED' WHERE id=$1", [ride_id]);
    res.json({ message: "Ride started" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start ride" });
  }
});

// ------------------- COMPLETE RIDE -------------------
router.post("/complete-ride", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const { ride_id } = req.body;
    const ride = await pool.query("SELECT status FROM rides WHERE id=$1 AND driver_id=$2", [ride_id, req.user.id]);
    if (!ride.rows.length) return res.status(404).json({ message: "Ride not found or not started" });
    if (ride.rows[0].status !== "STARTED") return res.status(400).json({ message: "Can only complete started rides" });

    await pool.query("UPDATE rides SET status='COMPLETED' WHERE id=$1", [ride_id]);
    res.json({ message: "Ride completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete ride" });
  }
});

// ------------------- GET DRIVER REVIEWS -------------------
router.get("/reviews", authenticateToken, authorizeDriver, async (req, res) => {
  try {
    const reviews = await pool.query("SELECT * FROM reviews WHERE driver_id=$1", [req.user.id]);
    res.json(reviews.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;
