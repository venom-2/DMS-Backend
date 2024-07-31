const mongoose = require('mongoose');

// Schema for Subject
const SubjectSchema = mongoose.Schema({

    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectNAACCode: { type: String, required: true },
    subjectType: { type: String, required: true },
    year: { type: String, required: true }
    
});

// Export the model
module.exports = mongoose.model('Subject', SubjectSchema);