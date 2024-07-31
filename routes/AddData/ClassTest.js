const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const ClassTest = require('../../Model/ClassTest');
const router = express.Router();

router.post('/classtest',
    // Validation rules
    body('classTestNumber').isInt().withMessage('Class Test number must be an integer'),
    body('student').isMongoId().withMessage('Student ID must be a valid ObjectId'),
    body('year').isInt().withMessage('Year must be an integer'),
    body('branch').notEmpty().withMessage('Branch is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('semester').isInt().withMessage('Semester must be an integer'),
    body('session').notEmpty().withMessage('Session is required'),
    async (req, res) => {

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), success: false });
        }

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
            const { classTestNumber, student, year, branch, section, semester, session, marks } = req.body;

            // Check if class test already exists for the student and class test number
            const existingClassTest = await ClassTest.findOne({ classTestNumber, student });
            if (existingClassTest) {
                return res.status(400).json({ message: 'Class Test already exists for this student', success: false });
            }

            // Create new Class Test
            const newClassTest = new ClassTest({
                classTestNumber,
                student,
                year,
                branch,
                section,
                semester,
                session,
                marks
            });

            // Save Class Test
            await newClassTest.save();

            // Return Success
            return res.status(200).json({ message: 'Class Test added successfully', success: true });

        } catch (error) {

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });

        }
    }
);

module.exports = router;
