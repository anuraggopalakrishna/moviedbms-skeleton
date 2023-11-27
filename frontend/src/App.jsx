import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const App = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/1`);
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleAddMovie = async (movieData) => {
    try {
      const response = await axios.post(`${API_URL}/movies`, movieData);
      const newMovie = response.data.data;
      setMovies([...movies, newMovie]);
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`${API_URL}/movies/${movieId}`);
      setMovies(movies.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div>
      <h1>Movies List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <p><button onClick={() => handleDeleteMovie(movie._id)}>Delete</button></p>
          </li>
        ))}
      </ul>
      <h2>Add New Movie</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddMovie({ title: e.target.title.value, description: e.target.description.value });
        e.target.title.value = '';
        e.target.description.value = '';
      }}>
        <input type="text" placeholder="Title" name="title" />
        <textarea placeholder="Description" name="description" />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default App;
