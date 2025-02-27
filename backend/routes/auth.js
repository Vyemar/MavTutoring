const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Handle the signup POST request
router.post('/signup', async (req, res) => {
    const { firstName, lastName, phone, email, password, role } = req.body;

    try {
        // Create new user with the provided data
        const userData = {
            firstName,
            lastName,
            phone,
            email,
            password,
            role: role || 'Student' // Default to 'Student' if role is not provided
        };

        const newUser = new User(userData);
        const saveUser = await newUser.save();
        

        if (saveUser) {
            res.status(201).json({ message: 'Signup successful', user: saveUser });
            console.log('User saved successfully:', saveUser);
        }

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
});

// Handle the login POST request
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login request received:', req.body);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: "Invalid email or password" });
        }

        console.log('User found:', user);

        // Compare the plain password with the hashed password using the model method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ error: "Invalid email or password" });
        }

       

        // If login is successful, return the user's role
        return res.status(200).json({
            success: true,
            role: user.role,
            ID: user._id,
            message: `Login successful as ${user.role}`
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;