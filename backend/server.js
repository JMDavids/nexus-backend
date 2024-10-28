require('dotenv').config();
const path = require('path'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRouter');
const classRoutes = require('./routes/classRouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Handle SPA (Single Page Application) routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB successfully; running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
