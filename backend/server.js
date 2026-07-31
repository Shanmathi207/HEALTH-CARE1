const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Local demo storage for patients
const patients = [];

app.post("/add-patient", async (req, res) => {
  try {
    const patient = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...req.body
    };
    patients.push(patient);
    res.json({ message: "Patient saved successfully", patient });
  } catch (err) {
    res.status(500).json({ message: "Error saving patient" });
  }
});

// --- Auth Routes (AI added) ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Smart Care Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
