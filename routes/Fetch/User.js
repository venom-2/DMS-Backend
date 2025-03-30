const express = require("express");
const router = express.Router();
const pool = require("../../db");
require("dotenv").config();

router.get("/users", async (req, res) => {
  try {
    // Fetch users excluding Admin
    const allUsers = await pool.query(
      "select u.email,u.first_name,u.last_name,u.role,d.department_name from departments d, users u where u.department_id = d.department_id and role != $1",
      ["Admin"]
    );

    // Get rows
    const users = allUsers.rows;

    // Return user data
    return res.status(200).json({ users: users, success: true });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

module.exports = router;
