require('dotenv').config();
const path = require('path'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRouter');
const classRoutes = require('./routes/classRouter');
const messageRouter = require('./routes/messageRouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/messages', messageRouter);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Handle SPA (Single Page Application) routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Connected to DB successfully; running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
