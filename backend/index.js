const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb+srv://user_anurag:7KtbirHNtGDGDmay@cluster0.ftxrjk8.mongodb.net/movieDB';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connection successful");
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Movie = mongoose.model('Movie', movieSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// Create a new movie
app.post('/movies', async (req, res) => {
    const movieData = req.body;

    try {
        const newMovie = await Movie.create(movieData);
        res.status(201).json({
            message: 'Movie successfully inserted',
            data: newMovie,
        });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Error adding movie' });
    }
});

// Update movie
app.put('/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    const { title, description } = req.body;

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { title, description },
            { new: true } // Return the updated document
        );

        if (updatedMovie) {
            res.json({ message: 'Movie successfully updated', data: updatedMovie });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Error updating movie' });
    }
});

// Delete movie
app.delete('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if (deletedMovie) {
            res.json({ message: 'Movie successfully deleted', data: deletedMovie });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Error deleting movie' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
