
const express = require('express');
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getProfile, 
    verifyStudent, 
    getAllUsers 
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, admin, getAllUsers);
router.put('/verify/:userId', protect, admin, verifyStudent);

module.exports = router;
