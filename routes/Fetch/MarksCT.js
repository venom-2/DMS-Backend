const express = require('express');
const pool = require('../../db');
const router = express.Router();
router.get('/class-test',
    async (req, res) => {
        try {
            const marks = await pool.query("select s.roll_no, s.first_name ||' '||s.last_name name, s.semester_id ,a.subject_code,ast.type_name,a.marks_obtained from students s,assessment a, assessment_type ast where s.roll_no = a.roll_no and a.type_id = ast.type_id and ast.type_name != 'Assignment'");
            const response = marks.rows;
            res.status(200).json({ message: 'Marks fetched successfully',response, success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal Server Error', success: false });
        }

    });
module.exports = router;
