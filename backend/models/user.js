const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {
        type: String,
        required: true,  // or make it optional based on your requirements
        unique: true,    // Optional if phone number should be unique
    },
});

module.exports = mongoose.model('User', userSchema);
