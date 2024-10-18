const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/auth'); 
const reviewRoutes = require('./routes/reviewRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use( '/images', express.static(path.join(__dirname, 'images')));
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

// Mount the auth routes under /api/auth
app.use('/api/auth', authRoutes); 

// Serve static files from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/reviews', reviewRoutes);




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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});