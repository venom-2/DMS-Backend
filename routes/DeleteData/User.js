const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../Model/User');
const router = express.Router();

router.delete('/user/:id', async (req, res) => {
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

        // Get the User ID from the URL parameters
        const userId = req.params.id;

        // Check if User exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Delete the User
        await User.findByIdAndDelete(userId);

        // Return Success
        return res.status(200).json({ message: 'User deleted successfully', success: true });
    } catch (error) {
        // Log error
        console.log(error);

        // Return error
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});

module.exports = router;
