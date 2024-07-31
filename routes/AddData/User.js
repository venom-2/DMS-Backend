const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../Model/User');
const jwt = require('jsonwebtoken');

router.post('/user',
    body('name').notEmpty().withMessage('User name is required!'),
    body('email').isEmail().withMessage('Invalid Email!'),
    body('password').notEmpty().withMessage('Password is required!'),
    body('role').notEmpty().withMessage('Role is required!'),
    body('department').notEmpty().withMessage('Department is required!')
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
            const { name, email, password, role, department } = req.body;

            // Check if user already exists
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists', success: false });
            }

            // Encrypt Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create User
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
                department: department
            });

            // Save User
            await newUser.save();

            // Return Success
            return res.status(200).json({ message: 'User added successfully', success: true });

        } catch (error) {

            // Return error
            return res.status(500).json({ message: 'Internal Server Error', success: false });

        }

    });

module.exports = router;