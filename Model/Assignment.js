const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Assignment
const assignmentSchema = new Schema({

    assignmentNumber: { type: Number, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: Number, required: true },
    session: { type: String, required: true },
    marks: {
        Q1: { type: Number, default: 0},
        Q2: { type: Number, default: 0},
        Q3: { type: Number, default: 0},
        Q4: { type: Number, default: 0},
        Q5: { type: Number, default: 0}
    }

});

// Export the model
module.exports = mongoose.model('Assignment', assignmentSchema);
