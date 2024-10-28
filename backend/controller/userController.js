const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
    try {
        console.log('Incoming registration data:', req.body); // Log incoming request data

        const { username, firstName, lastName, email, password, role, subjects } = req.body;

        // **Input Validation**
        if (!username || !firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        // **Validate Role**
        if (!['tutor', 'student'].includes(role)) {
            console.log('Invalid role provided:', role); // Log invalid role issue
            return res.status(400).json({ message: 'Invalid role' });
        }

        // **Subjects Validation for Tutors**
        if (role === 'tutor') {
            if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
                return res.status(400).json({ message: 'Please select at least one subject.' });
            }
            // Optionally validate subjects against a predefined list
            const validSubjects = ['Maths', 'Maths Literacy', 'English', 'Life Science', 'Physical Science', 'Tourism', 'Business Studies', 'History', 'Geography'];
            const invalidSubjects = subjects.filter(subject => !validSubjects.includes(subject));
            if (invalidSubjects.length > 0) {
                return res.status(400).json({ message: `Invalid subjects selected: ${invalidSubjects.join(', ')}` });
            }
        }

        // **Check if the user already exists**
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with this email:', email); // Log duplicate email issue
            return res.status(400).json({ message: 'Email is already registered.' });
        }


        // **Create new user**
        const newUserData = {
            username,
            firstName,
            lastName,
            email,
            password,
            role
        };

        if (role === 'tutor') {
            newUserData.subjects = subjects; // Include subjects for tutors
        }

        const newUser = new User(newUserData);

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
    try {
        const { email, password, role } = req.body;
        console.log('Login attempt:', email);

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Validate user role
        if (user.role !== role) {
            return res.status(403).json({ message: 'Access denied. Incorrect role.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Prepare user data to send to the client
        const userData = {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            subjects: user.role === 'tutor' ? user.subjects : undefined
        };

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Configure your email transporter (using nodemailer)
const transporter = nodemailer.createTransport({
    // Replace with your email service configuration
    host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "662d76bf88d0df",
    pass: "6c384c62d38eba"
  }
});

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Find the user by email
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'No account with that email address exists.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token and set it with expiration
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // Create reset URL
        const resetURL = `http://localhost:3000/ResetPassword-Student.html?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

        // Send email
        const mailOptions = {
            from: '"Your App" <no-reply@yourapp.com>', // Sender address
            to: user.email,                             // List of receivers (user's email)
            subject: 'Password Reset',                  // Subject line
            text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
            html: `<p>You requested a password reset.</p>
                   <p>Click this <a href="${resetURL}">link</a> to reset your password.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, token, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Hash the token provided by the user
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by email and token, and check if token is not expired
        const user = await User.findOne({
            email: normalizedEmail,
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Update the user's password
        user.password = password; // The pre-save hook will hash this
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.updateUserSettings = async (req, res) => {
    try {
        const userId = req.user.userId; // Retrieved from the authentication middleware
        const { username, email, password } = req.body;

        // Validate input (you can use a validation library or write custom validation)
        // For simplicity, we'll assume the input is valid

        const updateData = {};

        if (username) {
            updateData.username = username;
        }

        if (email) {
            // Ensure the new email is not already in use
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already in use by another account.' });
            }
            updateData.email = email.toLowerCase().trim();
        }

        if (password) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prepare user data to send back (excluding sensitive information)
        const userData = {
            id: updatedUser._id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            subjects: updatedUser.role === 'tutor' ? updatedUser.subjects : undefined
        };

        res.status(200).json({ message: 'Settings updated successfully.', user: userData });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
