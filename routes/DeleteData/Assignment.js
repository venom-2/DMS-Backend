const express = require('express');
const jwt = require('jsonwebtoken');
const Assignment = require('../../Model/Assignment');
const router = express.Router();

router.delete('/assignment/:id', async (req, res) => {
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

        // Get the Assignment ID from the URL parameters
        const assignmentId = req.params.id;

        // Check if Assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found', success: false });
        }

        // Delete the Assignment
        await Assignment.findByIdAndDelete(assignmentId);

        // Return Success
        return res.status(200).json({ message: 'Assignment deleted successfully', success: true });
    } catch (error) {
        // Log error
        console.log(error);

        // Return error
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});

module.exports = router;
