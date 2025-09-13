const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
    try {
        let { username, email, password } = req.body || {};

        // Normalize inputs
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid payload', error: true, success: false });
        }
        username = username.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        // Validate inputs
        if (!email) {
            return res.status(400).json({ message: 'Email is required', error: true, success: false });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address', error: true, success: false });
        }
        if (!username) {
            return res.status(400).json({ message: 'Username is required', error: true, success: false });
        }
        if (username.length < 2 || username.length > 50) {
            return res.status(400).json({ message: 'Username must be between 2 and 50 characters', error: true, success: false });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required', error: true, success: false });
        }
        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({ message: 'Password must be between 8 and 128 characters', error: true, success: false });
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // at least one letter and one number
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one letter and one number', error: true, success: false });
        }

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already exists', error: true, success: false });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const payload = {
            username,
            email,
            password: hashPassword,
        };

        const newUser = new UserModel(payload);
        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: true,
            success: false
        });
    }
}
