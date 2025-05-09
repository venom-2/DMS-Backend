const express = require('express');
const pool = require('../../db');
const router = express.Router();
require('dotenv').config();

router.post('/assignfaculty',async (req, res) => {
        const { email, first_name, last_name, department_id, subject_code, phone_no } = req.body;

        try {
            const faculty = await pool.query('SELECT count(*) FROM faculty WHERE email = $1', [email]);
            if (faculty.rows[0].count > 0) {
                return res.status(400).json({ message: 'Faculty already exists!', success: false });
            }
            // Start transaction
            await pool.query('INSERT INTO faculty (email, first_name, last_name, department_id, subject_code, phone_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',[email, first_name, last_name, department_id, subject_code, phone_no]);

            await pool.query('COMMIT');
            // Return Faculty
            return res.status(201).json({ message: 'Faculty assigned & added successfully!', success: true });

        } catch (error) {

            console.error(error);
            return res.status(500).json({ message: 'Server Error', success: false });
        }
    }
);

module.exports = router;
