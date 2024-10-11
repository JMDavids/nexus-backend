require('dotenv').config();
const path = require('path'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRouter');

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);





mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB successfully; running on port ${port}')
        })
    })
    .catch((error) => {
        console.log(error)
    })

    