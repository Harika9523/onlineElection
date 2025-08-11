const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');

// Create new election
const createElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate, allowedDepartments, allowedYears } = req.body;
        
        const election = await Election.create({
            title,
            description,
            startDate,
            endDate,
            allowedDepartments,
            allowedYears,
            createdBy: req.user.id
        });

        res.status(201).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all elections
const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find({})
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get active elections for students
const getActiveElections = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const currentDate = new Date();
        
        const elections = await Election.find({
            isActive: true,
            isCompleted: false,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
            $or: [
                { allowedDepartments: { $in: [user.department] } },
                { allowedDepartments: { $size: 0 } }
            ],
            $or: [
                { allowedYears: { $in: [user.year] } },
                { allowedYears: { $size: 0 } }
            ]
        }).populate('createdBy', 'name email');

        res.json(elections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single election
const getElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id)
            .populate('createdBy', 'name email');
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        
        res.json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update election
const updateElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedElection = await Election.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedElection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Activate/Deactivate election
const toggleElectionStatus = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        election.isActive = !election.isActive;
        await election.save();

        res.json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete election
const completeElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        election.isCompleted = true;
        election.isActive = false;
        await election.save();

        res.json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete election
const deleteElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete related candidates and votes
        await Candidate.deleteMany({ election: req.params.id });
        await Vote.deleteMany({ election: req.params.id });
        await Election.findByIdAndDelete(req.params.id);

        res.json({ message: 'Election deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createElection,
    getAllElections,
    getActiveElections,
    getElection,
    updateElection,
    toggleElectionStatus,
    completeElection,
    deleteElection
};
