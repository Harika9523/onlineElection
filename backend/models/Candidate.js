const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    position: { type: String, required: true },
    manifesto: { type: String, required: true },
    image: { type: String },
    election: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    voteCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
