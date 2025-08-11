const express = require('express');
const {
    castVote,
    getVotingResults,
    getUserVotingHistory,
    getAllVotes,
    getVoteStatistics
} = require('../controllers/voteController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Student routes
router.post('/cast', protect, castVote);
router.get('/history', protect, getUserVotingHistory);
router.get('/results/:electionId', protect, getVotingResults);

// Admin routes
router.get('/', protect, admin, getAllVotes);
router.get('/statistics/:electionId', protect, admin, getVoteStatistics);

module.exports = router;
