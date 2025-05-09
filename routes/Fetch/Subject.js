const express = require('express');
const pool = require('../../db');
const router = express.Router();


// Fecth Subject by id
router.get('/subject', async (req, res) => {

    try {
        const subjects = await pool.query('SELECT * FROM subjects');
        const subject = subjects.rows;
        // Return Subject
        res.status(200).json({ success: true, subject });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', success: false });
    }

});

module.exports = router;