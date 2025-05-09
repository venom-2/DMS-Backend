const express = require('express');
const pool = require('./db');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT;

// Initialize Express
const app = express();

pool;

// Middleware to parse JSON
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Home Route ----> No Login Required
app.get('/', (req, res) => {
    res.send('<h1>Hello Krishna. . . </h1>');
});

//migrated to postgres db for login user
// Login Route ----> No Login Required
app.use('/', require('./routes/Login/Login'));


// Data addition routes
// Add Subject  ------> Login Required
app.use('/add', require('./routes/AddData/Subject'));

//migrated to postgres db for adding user
// Add User ------> Login Required
app.use('/add', require('./routes/AddData/User'));

// Add Assignment ------> Login Required
app.use('/add', require('./routes/AddData/Assignment'));

// Add Assessment------> 
app.use('/add', require('./routes/AddData/Assessment'));

// Add ClassTest ------> Login Required
app.use('/add', require('./routes/AddData/ClassTest'));

// Add Student ------> Login Required
app.use('/add', require('./routes/AddData/Student'));

// Add Attendance ------> Login Required
app.use('/add', require('./routes/AddData/Attendance'));

// Assign Faculty ------> Login Required
app.use('/add', require('./routes/AddData/AssignFaculty'));

// Data deletion routes
// Delete ClassTest ------> Login Required
app.use('/delete', require('./routes/DeleteData/ClassTest'));

// Delete Subject ------> Login Required
app.use('/delete', require('./routes/DeleteData/Subject'));

// Delete User ------> Login Required
app.use('/delete', require('./routes/DeleteData/User'));

// Delete Assignment ------> Login Required
app.use('/delete', require('./routes/DeleteData/Assignment'));

// Remove Assigned Subject -------> Login Required
app.use('/delete', require('./routes/DeleteData/RemoveAssignedSubject'));

// fetch data
// Fetch Faculty ------> Login Required
app.use('/fetch', require('./routes/Fetch/Faculty'));

// // Fetch Users ------> Login Required
app.use('/fetch', require('./routes/Fetch/User'));

// Fetch Subject ------> Login Required
app.use('/fetch', require('./routes/Fetch/Subject'));

// Fetch Students ------> Login Required
app.use('/fetch', require('./routes/Fetch/Students'));

// Fetch Class Test marks ------> Login Required
app.use('/fetch', require('./routes/Fetch/MarksAssignment'));

// Fetch Class Test marks ------> Login Required
app.use('/fetch', require('./routes/Fetch/MarksCT'));

// Fetch Class Test marks ------> Login Required
app.use('/fetch', require('./routes/Fetch/CO'));

// Fetch Admin Dashboard Cards Data
app.use('/fetch', require('./routes/Fetch/AdminData'));

// Upload .csv file
// Upload Student data ------> Login Required
app.use('/csv', require('./routes/UploadCSV/Student'));

// Listen to Port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}
);