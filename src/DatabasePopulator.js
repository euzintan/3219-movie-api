const mongoose = require("mongoose");
const fs = require("fs");
const Movie = require("./movieModel");

require("dotenv").config();

const DB =
  "mongodb+srv://taneuzin:qxh14n64ErSg7zg3@cluster0.qovc4gf.mongodb.net/?retryWrites=true&w=majority";

const initialise = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const rawData = fs.readFileSync("./resource/Movies.json");
  const movieArr = JSON.parse(rawData);

  movieArr.map((movie) => {
    Movie.create(movie);
  });
};

initialise();
