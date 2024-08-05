const express = require('express');
const Subject = require('../../Model/Subject');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Fecth Subject by id
router.get('/subject/:id', async (req, res) => {

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

        const { id } = req.params;

        // Fetch Subject from DB
        const subject = await Subject.findOne({ _id: id });

        // Check if subject exists
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found', success: false });
        }

        // Return Subject

        res.status(200).json({ success: true, subject });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }

});

// Fecth Subject by year
router.post('/subject', async (req, res) => {
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

        const { year } = req.body;

        // Fetch Subject from DB
        // Fetch all subjects
        const subjects = await Subject.find({year}); 

        // Return Subjects
        res.status(200).json({ success: true, subjects });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }

});

module.exports = router;