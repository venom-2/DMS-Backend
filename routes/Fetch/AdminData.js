const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/admin-data", async (req,res) => {
    try{
        const users = await pool.query("select count(*) from users");
        const authorisedUsers = users.rows[0];
        const students = await pool.query("select count(*) from students");
        const totalStudents = students.rows[0];
        const dept = await pool.query("select count(*) from departments");
        const departments = dept.rows[0];
        const faculties = await pool.query("select count(*) from faculty");
        const totalFaculties = faculties.rows[0];

        return res.status(200).json({
            authorisedUsers: authorisedUsers, 
            totalStudents: totalStudents,
            departments: departments,
            totalFaculties: totalFaculties
        })
    }
    catch (err){
        console.error("Error fetching users:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
    }
})

module.exports = router;