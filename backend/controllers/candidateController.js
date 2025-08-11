const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');

// Create new candidate
const createCandidate = async (req, res) => {
    try {
        const { name, studentId, email, department, year, position, manifesto, image, electionId } = req.body;

        // Check if election exists
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Check if student exists
        const student = await User.findOne({ studentId, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if candidate already exists for this election
        const existingCandidate = await Candidate.findOne({ 
            studentId, 
            election: electionId 
        });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate already exists for this election' });
        }

        const candidate = await Candidate.create({
            name,
            studentId,
            email,
            department,
            year,
            position,
            manifesto,
            image,
            election: electionId
        });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all candidates for an election
const getCandidatesByElection = async (req, res) => {
    try {
        const { electionId } = req.params;
        
        const candidates = await Candidate.find({ 
            election: electionId,
            isApproved: true 
        }).sort({ name: 1 });

        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all candidates (admin only)
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({})
            .populate('election', 'title')
            .sort({ createdAt: -1 });

        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single candidate
const getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
            .populate('election', 'title description');
        
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update candidate
const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedCandidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve/Reject candidate
const approveCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        candidate.isApproved = !candidate.isApproved;
        await candidate.save();

        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Candidate.findByIdAndDelete(req.params.id);

        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCandidate,
    getCandidatesByElection,
    getAllCandidates,
    getCandidate,
    updateCandidate,
    approveCandidate,
    deleteCandidate
};
