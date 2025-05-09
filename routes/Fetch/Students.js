const express = require('express');
const router = express.Router();
const pool = require('../../db');
require('dotenv').config();

router.get('/students', async (req, res) => {
    try {
        const studentsQuery = await pool.query("select roll_no, first_name||' '||last_name name,email,gender,semester_id semester from students");
        const studentsResult = studentsQuery.rows; // Fetch all students
        // Return Students
        return res.status(200).json({ message: 'Students fetched successfully!', studentsResult, success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
});

module.exports = router;