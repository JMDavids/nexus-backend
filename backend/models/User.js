const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['tutor', 'student'], default: 'tutor' },
    subjects: { type: [String], required: function() { return this.role === 'tutor'; } },
    streak: { type: Number, default: 0 },
    rating: {type: Number, min: 0, max: 5, default: 0},
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {timestamps: true});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema)