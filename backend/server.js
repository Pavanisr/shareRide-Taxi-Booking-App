require("dotenv").config();
const express = require("express");
const cors = require("cors");

//const passengerRoutes = require("./routes/passengerRoutes");
//const driverRoutes = require("./routes/driverRoutes");

const app = express();
const pool = require("./db"); 

app.use(cors());
app.use(express.json());

//app.use("/api/passenger", passengerRoutes);
//app.use("/api/driver", driverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
