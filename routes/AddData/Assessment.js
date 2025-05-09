const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.post('/create', async (req, res) => {
    try {
        const { type_id, subject_code, roll_no, semester_id, marks } = req.body;

        let max_marks = 0, marks_obtained = 0;

        // For calculating max_marks and marks_obtained for the assessment
        for (let i = 0; i < marks.length; i++) {
            max_marks += marks[i].max_marks;
            marks_obtained += marks[i].marks_obtained;
        }

        const result = await pool.query("SELECT COALESCE(MAX(assessment_id), 0) + 1 AS new_id FROM assessment");
        const assessment_id = result.rows[0].new_id;

        // Inserting the assessment details into the assessment table
        const newAssessment = await pool.query(
            "INSERT INTO assessment (assessment_id, type_id, subject_code, max_marks, roll_no, semester_id, marks_obtained) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [assessment_id, type_id, subject_code, max_marks, roll_no, semester_id, marks_obtained]
        );

        // Getting the assessment_id of the newly inserted assessment
        const new_assessment_id = newAssessment.rows[0].assessment_id;

        const qResult = await pool.query("SELECT COALESCE(MAX(question_id), 0) + 1 AS new_qid FROM questions");
        let question_id = qResult.rows[0].new_qid;

        // Inserting the questions and marks into the questions table
        for (let i = 0; i < marks.length; i++) {
            const { question_no, max_marks, question_text, co, marks_obtained } = marks[i];
            const newMarks = await pool.query(
                `INSERT INTO questions (question_id, assessment_id, question_no, max_marks, question_text, co, marks_obtained) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [question_id++, new_assessment_id, question_no, max_marks, question_text, co, marks_obtained]
            );
        }

        res.json(newAssessment.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
