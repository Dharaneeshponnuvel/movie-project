const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');
const moviesRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static file serving from volumes
// These directories are mounted from Docker volumes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/trailer', express.static(path.join(__dirname, 'trailer')));

// MongoDB connection using environment variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviestream';
//
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/movie', movieRoutes);
app.use('/api', moviesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
