const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');

// Cast a vote
const castVote = async (req, res) => {
    try {
        const { candidateId, electionId } = req.body;
        const voterId = req.user.id;

        // Check if election exists and is active
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (!election.isActive) {
            return res.status(400).json({ message: 'Election is not active' });
        }

        const currentDate = new Date();
        if (currentDate < election.startDate || currentDate > election.endDate) {
            return res.status(400).json({ message: 'Voting period is not open' });
        }

        // Check if candidate exists and is approved
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        if (!candidate.isApproved) {
            return res.status(400).json({ message: 'Candidate is not approved' });
        }

        if (candidate.election.toString() !== electionId) {
            return res.status(400).json({ message: 'Candidate does not belong to this election' });
        }

        // Check if user has already voted in this election
        const existingVote = await Vote.findOne({ voter: voterId, election: electionId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Check if user is verified
        const user = await User.findById(voterId);
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Your account is not verified' });
        }

        // Create vote
        const vote = await Vote.create({
            voter: voterId,
            candidate: candidateId,
            election: electionId,
            position: candidate.position,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Update candidate vote count
        candidate.voteCount += 1;
        await candidate.save();

        // Update election total votes
        election.totalVotes += 1;
        await election.save();

        // Mark user as voted
        user.hasVoted = true;
        await user.save();

        res.status(201).json({ message: 'Vote cast successfully', vote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get voting results for an election
const getVotingResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Only show results if election is completed or user is admin
        if (!election.isCompleted && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Results are not available yet' });
        }

        const candidates = await Candidate.find({ 
            election: electionId,
            isApproved: true 
        }).sort({ voteCount: -1 });

        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

        const results = candidates.map(candidate => ({
            id: candidate._id,
            name: candidate.name,
            position: candidate.position,
            department: candidate.department,
            voteCount: candidate.voteCount,
            percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : 0
        }));

        res.json({
            election: {
                title: election.title,
                totalVotes: election.totalVotes,
                isCompleted: election.isCompleted
            },
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's voting history
const getUserVotingHistory = async (req, res) => {
    try {
        const votes = await Vote.find({ voter: req.user.id })
            .populate('election', 'title')
            .populate('candidate', 'name position')
            .sort({ votedAt: -1 });

        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all votes (admin only)
const getAllVotes = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const votes = await Vote.find({})
            .populate('voter', 'name email studentId')
            .populate('election', 'title')
            .populate('candidate', 'name position')
            .sort({ votedAt: -1 });

        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get vote statistics
const getVoteStatistics = async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        const totalVotes = await Vote.countDocuments({ election: electionId });
        const totalCandidates = await Candidate.countDocuments({ 
            election: electionId, 
            isApproved: true 
        });

        // Get votes by position
        const votesByPosition = await Vote.aggregate([
            { $match: { election: election.electionId } },
            {
                $lookup: {
                    from: 'candidates',
                    localField: 'candidate',
                    foreignField: '_id',
                    as: 'candidate'
                }
            },
            { $unwind: '$candidate' },
            {
                $group: {
                    _id: '$candidate.position',
                    voteCount: { $sum: 1 }
                }
            }
        ]);

        res.json({
            election: {
                title: election.title,
                totalVotes: election.totalVotes,
                isCompleted: election.isCompleted
            },
            statistics: {
                totalVotes,
                totalCandidates,
                votesByPosition
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    castVote,
    getVotingResults,
    getUserVotingHistory,
    getAllVotes,
    getVoteStatistics
};
