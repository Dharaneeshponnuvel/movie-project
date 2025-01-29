const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/users');
// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        const totalUsers = users.length;
        res.json({ totalUsers, users });
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
});

// Search users by name
router.get('/users/search', async (req, res) => {
    try {
        const { name } = req.query;
        const users = await Users.find({ username: { $regex: name, $options: 'i' } });
        res.json(users);
    } catch (err) {
        res.status(500).send('Error searching users');
    }
});

// DELETE user route (Fixed the model reference here)
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await Users.findByIdAndDelete(id); // Fixed 'User' -> 'Users'

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;
