const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
     useNewUrlParser: true, 
     useUnifiedTopology: true 
    })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => { 
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  });

// Mount the book routes under /api/books
app.use('/api/books', bookRoutes);

// Serve static files from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Development vs Production setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
