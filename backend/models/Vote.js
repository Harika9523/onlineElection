const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    candidate: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Candidate', 
        required: true 
    },
    election: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    position: { type: String, required: true },
    votedAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Ensure one vote per voter per election
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
