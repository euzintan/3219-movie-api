const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  actor: {
    type: String,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
