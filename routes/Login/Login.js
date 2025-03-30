const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../../db');


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

        // destructuring email,password and role from req.body
        const { email, password, role } = req.body;
        var dept = '';

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1 and role = $2', [email, role]);
        if (role === 'Admin') {
            dept = 'Admin-IMS';
        }
        else {
            const userDept = await pool.query('select d.department_name from departments d, users u where u.department_id = d.department_id and email = $1', [email]);
            dept = userDept.rows[0].department_name;
        }
        console.log(userResult.rows);

        // check if user exists or not
        if (userResult.rows.length === 0) {
            return res.status(401).json({ 'message': 'Invalid email or password' });
        }

        const user = userResult.rows[0];
        console.log(user);
        console.log(dept);

        // comparing password from user and from DB
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ 'message': 'Invalid email or password' });
        }

        // generate jwt token
        const token = jwt.sign(
            { userId: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, department: dept },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(token);

        res.json({ message: 'Login successful! ', token, success: true });


    } catch (error) {

        console.log(error);

        // Return Error
        res.status(500).json({ message: 'Internal Server Error', success: false });

    }
});

module.exports = router;