const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes'); // Make sure this points to your book routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// API Routes
app.use(bookRoutes); // Make sure this points to your book routes

// Serve React frontend (for production)
// Update the path to match your folder structure
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to send the index.html from the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
