const express = require('express');
const jwt = require('jsonwebtoken');
const Subject = require('../../Model/Subject');
const router = express.Router();

router.delete('/subject/:id', async (req, res) => {
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

        // Get the Subject ID from the URL parameters
        const subjectId = req.params.id;

        // Check if Subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found', success: false });
        }

        // Delete the Subject
        await Subject.findByIdAndDelete(subjectId);

        // Return Success
        return res.status(200).json({ message: 'Subject deleted successfully', success: true });
    } catch (error) {
        // Log error
        console.log(error);

        // Return error
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});

module.exports = router;
