const express = require('express');
const {
    createCandidate,
    getCandidatesByElection,
    getAllCandidates,
    getCandidate,
    updateCandidate,
    approveCandidate,
    deleteCandidate
} = require('../controllers/candidateController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (for students)
router.get('/election/:electionId', protect, getCandidatesByElection);
router.get('/:id', protect, getCandidate);

// Admin routes
router.post('/', protect, admin, createCandidate);
router.get('/', protect, admin, getAllCandidates);
router.put('/:id', protect, admin, updateCandidate);
router.put('/:id/approve', protect, admin, approveCandidate);
router.delete('/:id', protect, admin, deleteCandidate);

module.exports = router;
