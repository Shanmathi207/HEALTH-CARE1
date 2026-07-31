const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const loginErrorLog = path.join(__dirname, '..', 'login-error.log');

function logLoginError(message, details) {
    const entry = `[${new Date().toISOString()}] ${message} ${JSON.stringify(details || {})}\n`;
    fs.appendFileSync(loginErrorLog, entry, 'utf8');
}

// Login Route
router.post('/login', async (req, res) => {
    try {
        console.log('Login request body:', req.body);
        const { email, password, userType } = req.body;

        // Find user by email and userType
        const user = await User.findOne({ email, userType });
        console.log('Found user:', !!user, user && { email: user.email, userType: user.userType });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or user type' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        logLoginError('Login error', { error: err.message, stack: err.stack, body: req.body });
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const {
            name, email, password, phone, userType,
            age, gender,
            specialization, department,
            hospitalName
        } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const userData = {
            name, email, password, phone, userType
        };

        // Add role-based fields
        if (userType === 'patient') {
            userData.age = age;
            userData.gender = gender;
        } else if (userType === 'doctor') {
            userData.specialization = specialization;
            userData.department = department;
        } else if (userType === 'hospital') {
            userData.hospitalName = hospitalName;
        }

        const user = new User(userData);
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server registration error' });
    }
});

module.exports = router;
