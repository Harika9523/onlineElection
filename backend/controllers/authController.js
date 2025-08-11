
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, studentId, university, department, year, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        if (studentId) {
            const studentExists = await User.findOne({ studentId });
            if (studentExists) return res.status(400).json({ message: 'Student ID already exists' });
        }

        const user = await User.create({ 
            name, 
            email, 
            password, 
            studentId, 
            university, 
            department, 
            year, 
            role: role || 'student' 
        });
        
        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            studentId: user.studentId,
            university: user.university,
            department: user.department,
            year: user.year,
            token: generateToken(user.id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                studentId: user.studentId,
                university: user.university,
                department: user.department,
                year: user.year,
                isVerified: user.isVerified,
                hasVoted: user.hasVoted,
                token: generateToken(user.id) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId,
            university: user.university,
            department: user.department,
            year: user.year,
            isVerified: user.isVerified,
            hasVoted: user.hasVoted,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, university, department, year } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.department = department || user.department;
        user.year = year || user.year;

        const updatedUser = await user.save();
        res.json({ 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            role: updatedUser.role,
            studentId: updatedUser.studentId,
            university: updatedUser.university,
            department: updatedUser.department,
            year: updatedUser.year,
            isVerified: updatedUser.isVerified,
            hasVoted: updatedUser.hasVoted,
            token: generateToken(updatedUser.id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        res.json({ message: 'Student verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getProfile, 
    verifyStudent, 
    getAllUsers 
};
