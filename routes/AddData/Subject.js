const express = require('express');
const Subject = require('../../Model/Subject');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

router.post('/subject',
    body('subjectName').notEmpty().withMessage('Subject Name is required'),
    body('subjectCode').notEmpty().withMessage('Subject Code is required'),
    body('subjectNAACCode').notEmpty().withMessage('Subject NAAC Code is required'),
    body('subjectType').notEmpty().withMessage('Subject Type is required'),
    body('year').notEmpty().withMessage('Year is required')
    , async (req, res) => {

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

            // Check if user is authorized
            let payload;
            try {
                payload = jwt.verify(authToken, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token', success: false });
            }

            // De-structure req body
            const { subjectName, subjectCode, subjectNAACCode, subjectType, year } = req.body;

            // Check if subject exists
            const subject = await Subject.findOne({ subjectCode, subjectNAACCode });
            if (subject) {
                return res.status(400).json({ message: 'Subject already exists', success: false });
            }

            // Create new Subject
            const newSubject = new Subject({
                subjectName,
                subjectCode,
                subjectNAACCode,
                subjectType,
                year
            });

            // Save Subject
            await newSubject.save();

            // Return Success
            return res.status(200).json({ message: 'Subject added successfully', success: true });

        } catch (error) {

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });

        }
    });

module.exports = router;