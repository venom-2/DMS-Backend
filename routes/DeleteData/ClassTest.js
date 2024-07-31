const express = require('express');
const jwt = require('jsonwebtoken');
const ClassTest = require('../../Model/ClassTest');
const router = express.Router();

router.delete('/classtest/:id', async (req, res) => {
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

        // Get the Class Test ID from the URL parameters
        const classTestId = req.params.id;

        // Check if Class Test exists
        const classTest = await ClassTest.findById(classTestId);
        if (!classTest) {
            return res.status(404).json({ message: 'Class Test not found', success: false });
        }

        // Delete the Class Test
        await ClassTest.findByIdAndDelete(classTestId);

        // Return Success
        return res.status(200).json({ message: 'Class Test deleted successfully', success: true });
    } catch (error) {
        // Log error
        console.log(error);

        // Return error
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});

module.exports = router;
