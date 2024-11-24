const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../../Model/Student');
require('dotenv').config();

router.post('/students', async (req, res) => {
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

        const { year } = req.body;

        // Fetch Students from DB
        const students = await Student.find({ year });

        // Check if students exists
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'Students not found', success: false });
        }

        // Return Students
        return res.status(200).json({ message: 'Students fetched successfully!', students, success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
});

module.exports = router;