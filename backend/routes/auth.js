const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/admin');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, Address, Gender } = req.body;

        if (!username || !email || !password || !phone || !Address || !Gender) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            Adderss,
            Gender,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!password || (!email && !phone)) {
            return res.status(400).json({ error: 'Password and email or phone are required' });
        }

        // Check if email or phone is provided, prioritize email if both are provided
        const query = email ? { email } : { phone };
        const user = await User.findOne(query);

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Login
// Admin Login (No password hashing)
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Plaintext password check instead of bcrypt
        if (password !== admin.password) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                username: admin.username,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }

});
module.exports = router;
