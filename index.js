const express = require('express');
const connectToDB = require('./db');
const cors = require('cors');

// Initialize Express
const app = express();

connectToDB();

// Middleware to parse JSON
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Home Route ----> No Login Required
app.get('/', (req, res) => {
    res.send('<h1>Hello Krishna. . . </h1>');
});

// Login Route ----> No Login Required
app.use('/', require('./routes/Login/Login'));


// Data addition routes
// Add Subject  ------> Login Required
app.use('/add', require('./routes/AddData/Subject'));

// Add User ------> Login Required
app.use('/add', require('./routes/AddData/User'));

// Add Assignment ------> Login Required
app.use('/add', require('./routes/AddData/Assignment'));

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

// Fetch Subject ------> Login Required
app.use('/fetch', require('./routes/Fetch/Subject'));


// Upload .csv file
// Upload Student data ------> Login Required
app.use('/csv', require('./routes/UploadCSV/Student'));

// Listen to Port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
}
);