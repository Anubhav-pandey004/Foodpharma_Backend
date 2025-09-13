const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getCookieOptions = require('../utils/cookies');

module.exports = async (req, res) => {
    try {
        let { email, password } = req.body || {};

        // Basic validation and normalization
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid payload', error: true, success: false });
        }
        email = email.trim().toLowerCase();
        password = password.trim();

        if (!email) {
            return res.status(400).json({ message: 'Email is required', error: true, success: false });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required', error: true, success: false });
        }

        // Do not disclose whether the user exists to prevent enumeration
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password', error: true, success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password', error: true, success: false });
        }

        // Minimal token payload
        const tokendata = { _id: user._id, email: user.email };
        const token = jwt.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '8h' });

        const cookieOptions = getCookieOptions({ ttlMs: 8 * 60 * 60 * 1000 });

        // Set HttpOnly cookie; do not return token in body
        res.cookie('token', token, cookieOptions).status(200).json({
            message: 'Signed in successfully',
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: true,
            success: false
        });
    }
};
