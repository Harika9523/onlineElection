const express = require('express');
const {
    createElection,
    getAllElections,
    getActiveElections,
    getElection,
    updateElection,
    toggleElectionStatus,
    completeElection,
    deleteElection
} = require('../controllers/electionController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (for students)
router.get('/active', protect, getActiveElections);
router.get('/:id', protect, getElection);

// Admin routes
router.post('/', protect, admin, createElection);
router.get('/', protect, admin, getAllElections);
router.put('/:id', protect, admin, updateElection);
router.put('/:id/toggle', protect, admin, toggleElectionStatus);
router.put('/:id/complete', protect, admin, completeElection);
router.delete('/:id', protect, admin, deleteElection);

module.exports = router;
