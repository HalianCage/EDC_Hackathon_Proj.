const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Sign-Up Route
router.post('/signup', async (req, res) => {
    const { name, age, education, username, email, password } = req.body;

    try {
        // Check if the email already exists
        let user = await User.findOne({ email });
        if (user) {
            req.flash('error', 'Email already exists');
            return res.redirect('/signup');
        }

        // Create a new user
        user = new User({ name, age, education, username, email, password });

        // Save the user
        await user.save();

        // If the user is authenticated, store user info in session
        req.session.user = user;
        // Redirect to login page after successful registration
        res.redirect('/main');
    } catch (err) {
        console.log('Error during signup:', err);
        req.flash('error', 'Server error');
        res.redirect('/signup');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            req.flash('error', 'Invalid email or password');
            return res.redirect('/loginPage');
        }

        // Check password
        if (user.password !== password) {
            console.log('Password mismatch for user:', email);
            req.flash('error', 'Invalid email or password');
            return res.redirect('/loginPage');
        }

        // If the user is authenticated, store user info in session
        req.session.user = user;
        res.redirect('/main');
    } catch (err) {
        console.log('Error during login:', err);
        req.flash('error', 'Server error');
        res.redirect('/loginPage');
    }
});

module.exports = router;
