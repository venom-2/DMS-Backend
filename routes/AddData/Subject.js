const express = require('express');
const pool = require('../../db');
const router = express.Router();

router.post('/subject',
     async (req, res) => {

        try {

            // De-structure req body
            const { subject_code, nba_code, subject_name, subject_type, subject_year,subject_semester_id, department_id } = req.body;

            // Check if subject exists
            const subject = await pool.query('SELECT count(*) FROM subjects WHERE subject_code = $1', [subject_code]);
            if (subject.rows[0].count > 0) {
                return res.status(400).json({ message: 'Subject already exists', success: false });
            }

            // Create new Subject
            await pool.query('INSERT INTO subjects VALUES ($1, $2, $3, $4, $5, $6, $7)', [subject_code, nba_code, subject_name, subject_type, subject_year, subject_semester_id, department_id]);

            // Save Subject
            await pool.query('COMMIT');

            // Return Success
            return res.status(201).json({ message: 'Subject added successfully', success: true });

        } catch (error) {
            console.error('Error adding subject:', error);
            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });

        }
    });

module.exports = router;