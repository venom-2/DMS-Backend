const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Student = require('../../Model/Student'); 
const router = express.Router();

// Route to add a student
router.post('/student',
    // Validation rules
    body('name').notEmpty().withMessage('Name is required'),
    body('rollNumber').notEmpty().withMessage('Roll Number is required'),
    body('year').isInt().withMessage('Year must be an integer'),
    body('branch').notEmpty().withMessage('Branch is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('email').isEmail().withMessage('Invalid Email!'),
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
            const { name, rollNumber, year, branch, section, email } = req.body;

            // Check if student already exists
            const existingStudent = await Student.findOne({ rollNumber });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student with this Roll Number already exists', success: false });
            }

            // Create new Student
            const newStudent = new Student({
                name,
                rollNumber,
                year,
                branch,
                section,
                email
            });

            // Save Student
            await newStudent.save();

            // Return Success
            return res.status(201).json({ message: 'Student added successfully', success: true });

        } catch (error) {
            // Log error
            console.error(error);

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });
        }
    }
);

module.exports = router;
