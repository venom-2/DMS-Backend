const mongoose = require('mongoose');

// Schema for User
const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    assignedSubjects: { type: [String] }
    
});

// Export the model
module.exports = mongoose.model('User', UserSchema);