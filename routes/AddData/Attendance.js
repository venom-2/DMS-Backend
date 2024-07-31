const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Attendance = require('../../Model/Attendance');
const router = express.Router();

// Route to add attendance
router.post('/attendance',
    // Validation rules
    body('student').isMongoId().withMessage('Student ID must be a valid ObjectId'),
    body('subject').isMongoId().withMessage('Subject ID must be a valid ObjectId'),
    body('year').isInt().withMessage('Year must be an integer'),
    body('branch').notEmpty().withMessage('Branch is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('semester').isInt().withMessage('Semester must be an integer'),
    body('date').isISO8601().withMessage('Date must be a valid date'),
    body('status').isIn(['Present', 'Absent']).withMessage('Status must be either Present or Absent'),
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
            const { student, subject, year, branch, section, semester, date, status } = req.body;

            // Find if attendance already exists for the student, subject and date
            const existingAttendance = await Attendance.findOne({ student, subject, date });
            if (existingAttendance) {
                return res.status(400).json({ message: 'Attendance already exists for this student, subject and date', success: false });
            }

            // Create new Attendance record
            const newAttendance = new Attendance({
                student,
                subject,
                year,
                branch,
                section,
                semester,
                date,
                status
            });

            // Save Attendance
            await newAttendance.save();

            // Return Success
            return res.status(201).json({ message: 'Attendance added successfully', success: true });

        } catch (error) {
            // Log error
            console.error(error);

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });
        }
    }
);

module.exports = router;
