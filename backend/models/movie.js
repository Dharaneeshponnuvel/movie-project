const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    summary: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    trailerUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    language: { type: String, required: false },
    movie:{type:String,required: true}
});
//mm
module.exports = mongoose.model('Movie', movieSchema);
