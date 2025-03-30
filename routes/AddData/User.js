const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../db');
require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post('/user',
    body('first_name').notEmpty().withMessage('User name is required!'),
    body('email').isEmail().withMessage('Invalid Email!'),
    body('password').notEmpty().withMessage('Password is required!'),
    body('role').notEmpty().withMessage('Role is required!'),
    body('department_id').notEmpty().withMessage('Department is required!')
    , async (req, res) => {

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), success: false });
        }

        try {

            // Check if user is authorized
            const authToken = req.header('authToken');
            if (!authToken) {
                return res.status(401).json({ message: 'Access denied!', success: false });
            }

            // Check if user is authorized
            let payload;
            try {
                payload = jwt.verify(authToken, process.env.JWT_SECRET);
            } catch (error) {

                console.log(error);
                return res.status(401).json({ message: 'Invalid token', success: false });
            }

            // De-structure data
            const { first_name, last_name, email, password, role, department_id } = req.body;

            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Encrypt Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create User
            const newUser = await pool.query('INSERT INTO users (email, first_name, last_name, password, role,department_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *',
                [email, first_name, last_name, hashedPassword, role, department_id]);

            console.log(newUser.rows[0]);
            // Check if user was created successfully
            if (!newUser.rows[0]) {
                return res.status(500).json({ message: 'Error creating user', success: false });
            }

            // Save User
            await pool.query('COMMIT');

            // Return Success
            return res.status(200).json({ message: 'User added successfully', success: true });

        } catch (error) {
            console.log(error);

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });

        }

    });

module.exports = router;