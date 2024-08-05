const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Model/User');
require('dotenv').config();

router.delete('/assignedsubject', async (req, res) => {
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

        const { userId, subjectId } = req.body;

        // Fetch the user from DB
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Check if subject is assigned to user
        const subjectIndex = user.assignedSubjects.indexOf(subjectId);
        if (subjectIndex === -1) {
            return res.status(404).json({ message: 'Subject not found in user\'s assigned subjects', success: false });
        }

        // Remove the subject from the user's assigned subjects
        user.assignedSubjects.pull(subjectId);
        await user.save();

        // Return success response
        res.status(200).json({ message: 'Subject removed successfully', success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
});

module.exports = router;
