const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb+srv://user_anurag:7KtbirHNtGDGDmay@cluster0.ftxrjk8.mongodb.net/movieDB';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB database'));

const app = express();
app.use(cors());
app.use(express.json());

// Insert movie
app.post('/movies', async (req, res) => {
    const movie = req.body;

    try {
        const newMovie = await db.collection('movies').insertOne(movie);
        res.status(201).json({
            message: 'Movie successfully inserted',
            data: newMovie.ops[0],
        });
    } catch (error) {
        console.error('Error inserting movie:', error);
        res.status(500).json({ error: 'Error inserting movie' });
    }
});

// Get movie by ID
app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await db.collection('movies').findOne({ _id: movieId });
        if (movie) {
            res.json({
                message: 'Movie found',
                data: movie,
            });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error getting movie:', error);
        res.status(500).json({ error: 'Error getting movie' });
    }
});

// Update movie
app.put('/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    const updatedMovie = req.body;

    try {
        await db.collection('movies').updateOne({ _id: movieId }, { $set: updatedMovie });
        res.json({ message: 'Movie successfully updated' });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Error updating movie' });
    }
});

// Delete movie
app.delete('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        await db.collection('movies').deleteOne({ _id: movieId });
        res.json({ message: 'Movie successfully deleted' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Error deleting movie' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
