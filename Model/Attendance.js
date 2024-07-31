const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
