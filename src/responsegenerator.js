const {
  validDescriptionChecker,
  validTitleChecker,
  validRatingChecker,
  validActorChecker,
} = require("./checkers");

function generateMovieObject(reqBody) {
  let obj = {
    title: reqBody.title,
    rating: reqBody.rating,
    description: reqBody.description,
    actor: reqBody.actor,
  };
  return obj;
}

function generateModifiedMovieObject(reqBody, ori, res) {
  let newObj = { title: reqBody.title };
  if (reqBody.rating && validRatingChecker(reqBody, res)) {
    newObj.rating = reqBody.rating;
  } else {
    newObj.rating = ori.rating;
  }
  if (reqBody.description && validDescriptionChecker(reqBody, res)) {
    newObj.description = reqBody.description;
  } else {
    newObj.description = ori.description;
  }
  if (reqBody.actor && validActorChecker(reqBody, res)) {
    newObj.actor = reqBody.actor;
  } else {
    newObj.actor = ori.actor;
  }
  return newObj;
}

module.exports = { generateMovieObject, generateModifiedMovieObject };
