const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    totalVotes: { type: Number, default: 0 },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    allowedDepartments: [{ type: String }],
    allowedYears: [{ type: Number }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Election', electionSchema);
