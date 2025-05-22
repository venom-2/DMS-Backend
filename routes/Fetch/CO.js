const express = require('express');
const pool = require('../../db');
const router = express.Router();

router.post('/course-outcome', async (req, res) => {
    const { semester_id, subject_code, target } = req.body;
    const result = {
        ct1: {
            co1_count_ct1: 0,
            co2_count_ct1: 0,
            co3_count_ct1: 0,
            co4_count_ct1: 0,
            co5_count_ct1: 0,
        },
        ct2: {
            co1_count_ct2: 0, 
            co2_count_ct2: 0,
            co3_count_ct2: 0,
            co4_count_ct2: 0,
            co5_count_ct2: 0,
        },
        put: {
            co2_count_put: 0,
            co2_count_put: 0,
            co3_count_put: 0,
            co4_count_put: 0,
            co5_count_put: 0,
        },
        assignment: {   
            co1: 0,
            co2: 0,
            co3: 0,
            co4: 0,
            co5: 0,
        },
        ut: {
            co1: 0,
            co2: 0,
            co3: 0,
            co4: 0,
            co5: 0,
        },
    };

    const students = await pool.query('SELECT * FROM students WHERE semester_id = $1',[semester_id]);

    // Temp value storage for COs
    // Assuming there are 5 COs, initialize them to 0
    let co1 = 0, co2 = 0, co3 = 0, co4 = 0, co5 = 0;

    // temp value of maximun cos
    let max_co1 = 0, max_co2 = 0, max_co3 = 0, max_co4 = 0, max_co5 = 0;

    // count of students having >= 60% in COs ct1
    let co1_count_ct1 = 0, co2_count_ct1 = 0, co3_count_ct1 = 0, co4_count_ct1 = 0, co5_count_ct1 = 0;

    // count of students having >= 60% in COs ct2
    let co1_count_ct2 = 0, co2_count_ct2 = 0, co3_count_ct2 = 0, co4_count_ct2 = 0, co5_count_ct2 = 0;

    // count of students having >= 60% in COs put
    let co1_count_put = 0, co2_count_put = 0, co3_count_put = 0, co4_count_put = 0, co5_count_put = 0;

    for (let i = 0; i < students.rows.length; i++) {
        const student = students.rows[i];
        const { roll_no } = student;

        // Fetching CT-01 details
        const ct1 = await pool.query('select a.type_id,ast.type_name,a.subject_code,s.subject_name,a.max_marks,a.roll_no,a.semester_id,a.marks_obtained,q.question_id,q.question_no,q.max_marks as max_mark,q.question_text,q.co,q.marks_obtained from assessment a,questions q,assessment_type ast, subjects s where ast.type_id = a.type_id and a.assessment_id = q.assessment_id and s.subject_code = a.subject_code AND a.type_id = 1 AND roll_no = $1 AND semester_id = $2 AND s.subject_code = $3;', [roll_no, semester_id, subject_code]);
       
        // if (ct1.rows.length === 0) {
        //     return res.status(200).json({ message: 'CT-01 details not found' });
        // }

        // Calculating COs for CT-01
        for (let j = 0; j < ct1.rows.length; j++) {
            const row = ct1.rows[j];
            if(row.co === 1) {
                co1 += row.marks_obtained;
                max_co1 += row.max_marks;
            } else if(row.co === 2) {
                co2 += row.marks_obtained;
                max_co2 += row.max_marks;
            } else if(row.co === 3) {
                co3 += row.marks_obtained;
                max_co3 += row.max_marks;
            } else if(row.co === 4) {
                co4 += row.marks_obtained;
                max_co4 += row.max_marks;
            } else if(row.co === 5) {
                co5 += row.marks_obtained;
                max_co5 += row.max_marks;
            }
        }

        // Calculating percentage for CT-01
        if (max_co1 > 0) {
            const percentage = (co1 / max_co1) * 100;
            if (percentage >= target) {
                co1_count_ct1++;
            }
        }
        if (max_co2 > 0) {
            const percentage = (co2 / max_co2) * 100;
            if (percentage >= target) {
                co2_count_ct1++;
            }
        }
        if (max_co3 > 0) {
            const percentage = (co3 / max_co3) * 100;
            if (percentage >= target) {
                co3_count_ct1++;
            }
        }
        if (max_co4 > 0) {
            const percentage = (co4 / max_co4) * 100;
            if (percentage >= target) {
                co4_count_ct1++;
            }
        }
        if (max_co5 > 0) {
            const percentage = (co5 / max_co5) * 100;
            if (percentage >= target) {
                co5_count_ct1++;
            }
        }


        // Initializing COs for CT-02 and PUT
        co1 = 0; co2 = 0; co3 = 0; co4 = 0; co5 = 0;
        max_co1 = 0; max_co2 = 0; max_co3 = 0; max_co4 = 0; max_co5 = 0;

        // Fetching CT-02 details
        const ct2 = await pool.query('select a.type_id,ast.type_name,a.subject_code,s.subject_name,a.max_marks,a.roll_no,a.semester_id,a.marks_obtained,q.question_id,q.question_no,q.max_marks as max_mark,q.question_text,q.co,q.marks_obtained from assessment a,questions q,assessment_type ast, subjects s where ast.type_id = a.type_id and a.assessment_id = q.assessment_id and s.subject_code = a.subject_code AND a.type_id = 2 AND roll_no = $1 AND semester_id = $2 AND s.subject_code = $3;', [roll_no, semester_id, subject_code]);
       
        // if (ct2.rows.length === 0) {
        //     return res.status(404).json({ message: 'CT-02 details not found' });
        // }

        for (let j = 0; j < ct2.rows.length; j++) {
            const row = ct2.rows[j];
            if(row.co === 1) {
                co1 += row.marks_obtained;
                max_co1 += row.max_marks;
            } else if(row.co === 2) {
                co2 += row.marks_obtained;
                max_co2 += row.max_marks;
            } else if(row.co === 3) {
                co3 += row.marks_obtained;
                max_co3 += row.max_marks;
            } else if(row.co === 4) {
                co4 += row.marks_obtained;
                max_co4 += row.max_marks;
            } else if(row.co === 5) {
                co5 += row.marks_obtained;
                max_co5 += row.max_marks;
            }
        }

        // Calculating percentage for CT-02

        if (max_co1 > 0) {
            const percentage = (co1 / max_co1) * 100;
            if (percentage >= target) {
                co1_count_ct2++;
            }
        }
        if (max_co2 > 0) {
            const percentage = (co2 / max_co2) * 100;
            if (percentage >= target) {
                co2_count_ct2++;
            }
        }
        if (max_co3 > 0) {
            const percentage = (co3 / max_co3) * 100;
            if (percentage >= target) {
                co3_count_ct2++;
            }
        }
        if (max_co4 > 0) {
            const percentage = (co4 / max_co4) * 100;
            if (percentage >= target) {
                co4_count_ct2++;
            }
        }
        if (max_co5 > 0) {
            const percentage = (co5 / max_co5) * 100;
            if (percentage >= target) {
                co5_count_ct2++;
            }
        }

        // Initializing COs for PUT
        co1 = 0; co2 = 0; co3 = 0; co4 = 0; co5 = 0;
        max_co1 = 0; max_co2 = 0; max_co3 = 0; max_co4 = 0; max_co5 = 0;

        // Fetching PUT details
        const put = await pool.query('select a.type_id,ast.type_name,a.subject_code,s.subject_name,a.max_marks,a.roll_no,a.semester_id,a.marks_obtained,q.question_id,q.question_no,q.max_marks as max_mark,q.question_text,q.co,q.marks_obtained from assessment a,questions q,assessment_type ast, subjects s where ast.type_id = a.type_id and a.assessment_id = q.assessment_id and s.subject_code = a.subject_code AND a.type_id = 1 AND roll_no = $1 AND semester_id = $2 AND s.subject_code = $3;', [roll_no, semester_id, subject_code]);
       
        // if (put.rows.length === 0) {
        //     return res.status(404).json({ message: 'PUT details not found' });
        // }

        for (let j = 0; j < ct1.rows.length; j++) {
            const row = put.rows[j];
            if(row.co === 1) {
                co1 += row.marks_obtained;
                max_co1 += row.max_marks;
            } else if(row.co === 2) {
                co2 += row.marks_obtained;
                max_co2 += row.max_marks;
            } else if(row.co === 3) {
                co3 += row.marks_obtained;
                max_co3 += row.max_marks;
            } else if(row.co === 4) {
                co4 += row.marks_obtained;
                max_co4 += row.max_marks;
            } else if(row.co === 5) {
                co5 += row.marks_obtained;
                max_co5 += row.max_marks;
            }
        }

        // Calculating percentage for PUT
        if (max_co1 > 0) {
            const percentage = (co1 / max_co1) * 100;
            if (percentage >= target) {
                co1_count_put++;
            }
        }
        if (max_co2 > 0) {
            const percentage = (co2 / max_co2) * 100;
            if (percentage >= target) {
                co2_count_put++;
            }
        }
        if (max_co3 > 0) {
            const percentage = (co3 / max_co3) * 100;
            if (percentage >= target) {
                co3_count_put++;
            }
        }
        if (max_co4 > 0) {
            const percentage = (co4 / max_co4) * 100;
            if (percentage >= target) {
                co4_count_put++;
            }
        }
        if (max_co5 > 0) {
            const percentage = (co5 / max_co5) * 100;
            if (percentage >= target) {
                co5_count_put++;
            }
        }

        // Resetting COs for next student
        co1 = 0; co2 = 0; co3 = 0; co4 = 0; co5 = 0;
        max_co1 = 0; max_co2 = 0; max_co3 = 0; max_co4 = 0; max_co5 = 0;

    }

    // Sending response with CO counts
    res.status(200).json(result);

});

module.exports = router;
