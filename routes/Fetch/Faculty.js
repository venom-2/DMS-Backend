const express = require('express');
const router = express.Router();
const pool = require('../../db');
require('dotenv').config();

router.get('/faculty', async (req, res) => {
    const { dept_id } = req.params;
    try {
        const faculties = await pool.query('SELECT * FROM faculty');
        const faculty = faculties.rows;
        if (faculty.length === 0) {
            return res.status(404).json({ message: 'No Faculty Found', success: false });
        }
        // Return Faculty
        return res.status(200).json({ message: 'Faculty fetched successfully!', faculty, success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
});

module.exports = router;
