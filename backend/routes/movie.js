const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Movie = require('../models/Movie');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "movie") cb(null, './uploads/');
        else if (file.fieldname === "image") cb(null, './images/');
        else if (file.fieldname === "trailer") cb(null, './trailer/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }//mm
});

const upload = multer({ storage }).fields([
    { name: 'movie', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'trailer', maxCount: 1 }
]);

// POST Route
router.post('/add-movie', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const { name, rating, summary, releaseDate, language } = req.body;
            const movie = `/uploads/${req.files['movie'][0].filename}`;
            const imageUrl = `/images/${req.files['image'][0].filename}`;
            const trailerUrl = `/trailer/${req.files['trailer'][0].filename}`;

            const newMovie = new Movie({ name, rating, summary, releaseDate, language, movie, imageUrl, trailerUrl });
            await newMovie.save();
            res.status(201).json({ message: 'Movie added successfully' });
        } catch (error) {
            console.error('Error adding movie:', error);
            res.status(500).json({ error: 'Failed to add movie' });
        }
    });
});


module.exports = router;
