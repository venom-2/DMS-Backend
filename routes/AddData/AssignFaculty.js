const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Subject = require('../../Model/Subject');
const User = require('../../Model/User');
require('dotenv').config();

router.post('/assignfaculty',
    [
        body('department').not().isEmpty().trim().escape(),
        body('userId').not().isEmpty().trim().escape(),
        body('subjectId').not().isEmpty().trim().escape()
    ]
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Invalid input!', errors: errors.array(), success: false });
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

            const { department, userId, subjectId } = req.body;

            // Fetch Faculty from DB
            const faculty = await User.findOne({ _id: userId, department });

            // Check if faculty exists
            if (!faculty) {
                return res.status(404).json({ message: 'Faculty not found', success: false });
            }

            // Check if course exists
            const course = await Subject.findOne({ _id: subjectId });
            if (!course) {
                return res.status(404).json({ message: 'Course not found', success: false });
            }

            // Check if faculty is already assigned to the course
            const isAssigned = faculty.assignedSubjects.find(subject => subject === subjectId); 
            if (isAssigned) {
                return res.status(200).json({ message: 'Faculty already assigned to the course!', success: false });
            }

            // Assign faculty to course
            faculty.assignedSubjects.push(subjectId);
            await faculty.save();

            // Return Faculty
            return res.status(200).json({ message: 'Faculty assigned successfully!', faculty, success: true });

        } catch (error) {

            console.error(error);
            return res.status(500).json({ message: 'Server Error', success: false });
        }
    }
);

module.exports = router;
