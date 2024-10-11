const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        console.log('Incoming registration data:', req.body); // Log incoming request data

        const { username, firstName, lastName, email, password, role, subjects } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists with this email:', email); // Log duplicate email issue
            return res.status(400).json({ message: 'User already exists' });
        }

        let newUser;
        if (role === 'tutor') {
            newUser = new User({
                username,  // Added username field
                firstName,
                lastName,
                email,
                password,
                role,
                subjects  // Only relevant for tutors
            });
        } else if (role === 'student') {
            newUser = new User({
                username,  // Added username field
                firstName,
                lastName,
                email,
                password,
                role
            });
        } else {
            console.log('Invalid role provided:', role); // Log invalid role issue
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Save user to the database
        await newUser.save();
        console.log('New user successfully saved:', newUser); // Log successful save

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error('Error during user registration:', err); // Log the full error message
        res.status(500).json({ message: 'Server error' });
    }
};


// Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Return user details along with the token
        res.status(200).json({
            message: `Welcome back, ${user.firstName}!`,
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};