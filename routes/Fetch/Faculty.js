const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Model/User');
require('dotenv').config();

router.post('/faculty', async (req, res) => {
    try {
        // Check if user is authorized
        const authToken = req.header('authToken');
        if (!authToken) {
            return res.status(401).json({ message: 'Access denied!', success: false });
        }

        // Verify the token
        let payload;
        try {
            payload = jwt.verify(authToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token', success: false });
        }

        const { department } = req.body;

        // Fetch Faculty from DB
        const faculty = await User.find({ department });

        // Check if faculty exists
        if (!faculty || faculty.length === 0) {
            return res.status(404).json({ message: 'Faculties not found', success: false });
        }

        // Return Faculty
        return res.status(200).json({ message: 'Faculty fetched successfully!', faculty, success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
});

module.exports = router;
