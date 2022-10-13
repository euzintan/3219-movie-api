const {
  validDescriptionChecker,
  validTitleChecker,
  validRatingChecker,
  validActorChecker,
} = require("./checkers");

const {
  generateMovieObject,
  generateModifiedMovieObject,
} = require("./responsegenerator");

const {
  signupHandler,
  loginUser,
  checkForUserAuthorization,
} = require("./auth");

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Movie = require("./movieModel");

const Redis = require("redis");
const redisClient = Redis.createClient({ host: "127.0.0.1", port: 6379 });

require("dotenv").config();

let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(express.json());
app.use(cors());

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .then(() => redisClient.flushDb())
  .then(() => console.log("Redis server has been flushed"));

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
const PORT = process.env.PORT || 3000;

redisClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

app.all("/", (req, res, next) => {
  res.json({ status: 200, message: "Hello welcome to Movie World" });
});

const rolesAllowed = ["User", "Admin"];
app.use("/movies", checkForUserAuthorization(rolesAllowed));

app.get("/movies", (req, res, next) => {
  res.json({ status: 200, movies });
});

app.get("/bigMovieData", async (req, res, next) => {
  const movies = await redisClient.get("movies");
  if (movies != null) {
    console.log("Data fetched from Redis cache");
    return res.json(JSON.parse(movies));
  } else {
    console.log("Data fetched from MongoDB");
    const movies = await Movie.find({});
    redisClient.setEx("movies", 3600, JSON.stringify(movies));
    return res.json({ status: 200, movies });
  }
});

app.post("/movies", (req, res, next) => {
  if (
    validTitleChecker(req.body, res) &&
    validRatingChecker(req.body, res) &&
    validDescriptionChecker(req.body, res) &&
    validActorChecker(req.body, res)
  ) {
    movies[idCounter] = generateMovieObject(req.body);
    idCounter++;
    return res.json({
      status: 201,
      message: req.body.title + " has been added",
    });
  }
});

app.put("/movies", function (req, res, next) {
  if (!validTitleChecker(req.body, res)) return;
  for (movie in movies) {
    if (movies[movie].title === req.body.title) {
      movies[movie] = generateModifiedMovieObject(req.body, movies[movie], res);
      return res.json({
        status: 200,
        message: req.body.title + " has been modified",
        movie: movies[movie],
      });
    }
  }
  if (
    validRatingChecker(req.body, res) &&
    validDescriptionChecker(req.body, res) &&
    validActorChecker(req.body, res)
  ) {
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
app.post("/signup", signupHandler);

app.get("/login", loginUser);

module.exports = app;
