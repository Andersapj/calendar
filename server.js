const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.options("*", cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "calendar",
  password: "Hongli24",
  port: 5432,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.post("/api/selected-days", async (req, res) => {
  const { username, email, selectedDays } = req.body;

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    // Insert each selected date along with user information into the database
    for (const day of selectedDays) {
      await client.query(
        "INSERT INTO selected_dates (username, email, date) VALUES ($1, $2, $3)",
        [username, email, day]
      );
    }

    await client.query("COMMIT");
    client.release();

    res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    console.error("Error saving dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
