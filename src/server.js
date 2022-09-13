const {
  validDescriptionChecker,
  validTitleChecker,
  validRatingChecker,
} = require("./checkers");

const {
  generateMovieObject,
  generateModifiedMovieObject,
} = require("./responsegenerator");

const express = require("express");
const app = express();
app.use(express.json());

let idCounter = 4;

let movies = {
  1: {
    title: "Batman",
    actor: "Bruce Wayne",
    rating: 4.2,
    description: "Bruce Wayne is Batman",
  },
  2: {
    title: "Superman",
    actor: "Henry Cavill",
    rating: 3.9,
    description: "Man of Steal",
  },
  3: {
    title: "Pokemon",
    actor: "Ash Ketchum",
    rating: 4.8,
    description: "Catch em all",
  },
};

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.all("/", (req, res, next) => {
  res.json({ status: 200, message: "Hello welcome to Movie World" });
});

app.get("/movies", (req, res, next) => {
  res.json({ status: 200, movies });
});

app.post("/movies", (req, res, next) => {
  if (
    validTitleChecker(req.body, res) &&
    validRatingChecker(req.body, res) &&
    validDescriptionChecker(req.body, res)
  ) {
    movies[idCounter] = generateMovieObject(req.body);
    idCounter++;
    return res.json({
      status: 201,
      message: req.body.title + " has been added",
    });
  }
});

app.put("/movies", (req, res, next) => {
  if (!validTitleChecker(req.body)) return;
  for (movie in movies) {
    if (movies[movie].title === req.body.title) {
      movies[movie] = generateModifiedMovieObject(req.body, movies[movie]);
      return res.json({
        status: 200,
        message: req.body.title + " has been modified",
        movie: movies[movie],
      });
    }
  }
  if (validRatingChecker(req.body) && validDescriptionChecker(req.body)) {
    movies[idCounter] = generateMovieObject(req.body);
    idCounter++;
    return res.json({
      status: 201,
      message: req.body.title + " has been added",
    });
  }
});

app.delete("/movies", (req, res, next) => {
  if (!req.query.id)
    return res.json({ status: 400, message: "Please specify movie ID" });

  if (movies[req.query.id]) {
    let target = movies[req.query.id].title;
    delete movies[req.query.id];
    return res.json({ status: 200, message: target + " has been deleted" });
  } else {
    responseString = "Movie with this ID does not exist";
    return res.json({
      status: 404,
      message: "Movie with the ID: " + req.query.id + " does not exist",
    });
  }
});

module.exports = app;
