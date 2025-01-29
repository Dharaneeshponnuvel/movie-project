const express = require('express');
const multer = require('multer');
const Movie = require('../models/movies');
const router = express.Router();

// Setup Multer for image uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Get all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies); // Send all movie details as JSON
    } catch (err) {
        res.status(500).send('Error retrieving movies');
    }
});

// Get a single movie's details
router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.json(movie); // Send the single movie details as JSON
    } catch (err) {
        res.status(500).send('Error retrieving movie');
    }
});

// Delete a movie
router.delete('/movies/:id', async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.send('Movie deleted');
    } catch (err) {
        res.status(500).send('Error deleting movie');
    }
});

// Update a movie
router.put('/movies/:id', upload.single('image'), async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Update the movie fields with new values
        movie.name = req.body.name || movie.name;
        movie.trailer = req.body.trailer || movie.trailer;
        movie.rating = req.body.rating || movie.rating;
        movie.summary = req.body.summary || movie.summary;
        movie.language = req.body.language || movie.language;
        movie.releaseDate = req.body.releaseDate || movie.releaseDate;

        // Update the image if a new one is provided
        if (req.file) {
            movie.image = req.file.path;
        }

        await movie.save();
        res.send('Movie updated');
    } catch (err) {
        res.status(500).send('Error updating movie');
    }
});

module.exports = router;
