const express = require('express');
const router = express.Router();
const User = require('../../Model/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.post('/login', [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').notEmpty().withMessage('Role is required')
], async (req, res) => {
    try {

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(req.body);
            return res.status(400).json({ errors: errors.array(), success: false });
        }

        // destructuring email and password from req.body
        const { email, password, role } = req.body;

        // Fetch User from DB
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found', sucess: false });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        // Check if role id correct
        if (role !== user.role) {
            return res.status(401).json({ message: 'Invalid credentials', sucess: false });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                department: user.department,
                assignedSubjects: user.assignedSubjects,
                email: user.email,
                name: user.name
            }
        };

        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Return User
        return res.status(200).json({ message: 'Login successful! ', authToken, success: true });

    } catch (error) {

        // Return Error
        res.status(500).json({ message: 'Internal Server Error', success: false });

    }
});

module.exports = router;