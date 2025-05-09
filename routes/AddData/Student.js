const express = require('express');
const pool = require('../../db');
const router = express.Router();

// Route to add a student
router.post('/student',async (req, res) => {

        try {
            // De-structure req body
            const { first_name,last_name,gender, roll_no, passing_year, admission_year,admission_id,admission_type,course_id, department_id, section, email,dob,category,disability,phone_no, semester_id } = req.body;

            // Check if student already exists
            const existingStudent = await pool.query('SELECT count(*) FROM students WHERE roll_no = $1', [roll_no]);
            if (existingStudent.rows[0].count!=0) {
                return res.status(400).json({ message: 'Student with this Roll Number already exists', success: false });
            }

            // Create new Student
            await pool.query(
                'INSERT INTO students VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *',
                [roll_no, first_name, last_name,department_id,semester_id, phone_no,admission_type, passing_year, section,email,admission_year,course_id,gender,disability,category,dob, admission_id]
            );

            // Save Student
            await pool.query('COMMIT');

            // Return Success
            return res.status(201).json({ message: 'Student added successfully', success: true });

        } catch (error) {
            // Log error
            console.error(error);

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });
        }
    }
);

module.exports = router;
