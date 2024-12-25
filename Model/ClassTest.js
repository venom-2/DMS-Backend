const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for ClassTest
const classTestSchema = new Schema({

    classTestNumber: { type: String, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: String, required: true },
    session: { type: String, required: true },
    marks: {
        sectionA: {
            _1a: { type: Number, default: 0 },
            _1b: { type: Number, default: 0 },
            _1c: { type: Number, default: 0 },
            _1d: { type: Number, default: 0 },
            _1e: { type: Number, default: 0}
        },
        sectionB: {
            _2a: { type: Number, default: 0},
            _2b: { type: Number, default: 0},
            _2c: { type: Number, default: 0},
            _2d: { type: Number, default: 0},
            _2e: { type: Number, default: 0}
        },
        sectionC: {
            _3: { type: Number, default: 0},
            _4: { type: Number, default: 0},
            _5: { type: Number, default: 0},
        }
    }

});

// Export the model
module.exports = mongoose.model('ClassTest', classTestSchema);

