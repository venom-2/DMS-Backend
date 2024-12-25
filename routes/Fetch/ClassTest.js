const express = require('express');
const jwt = require('jsonwebtoken');
const ClassTest = require('../../Model/ClassTest');
const router = express.Router();
router.post('/class-test',
    async (req, res) => {
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
            // De-structure req body
            const { classTestNumber,
                student,
                year,
                branch,
                section,
                semester,
                session } = req.body;
            // Save ClassTest
            const response = await ClassTest.findOne({ classTestNumber, student, year, branch, section, semester, session });
            res.status(200).json({ message: 'Class Test Marks fetched successfully',response, success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal Server Error', success: false });
        }

    });
module.exports = router;
