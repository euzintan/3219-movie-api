const {
  validDescriptionChecker,
  validTitleChecker,
  validRatingChecker,
} = require("./checkers");

function generateMovieObject(reqBody) {
  let obj = {
    title: reqBody.title,
    rating: reqBody.rating,
    description: reqBody.description,
  };
  return obj;
}

function generateModifiedMovieObject(reqBody, ori) {
  let newObj = { title: reqBody.title };
  if (reqBody.rating) {
    validRatingChecker(reqBody);
    newObj.rating = reqBody.rating;
  } else {
    newObj.rating = ori.rating;
  }
  if (reqBody.description) {
    validDescriptionChecker(reqBody);
    newObj.description = reqBody.description;
  } else {
    newObj.description = ori.description;
  }
  if (reqBody.actor) {
    validactorChecker(reqBody);
    newObj.actor = reqBody.actor;
  } else {
    newObj.actor = ori.actor;
  }
  return newObj;
}

module.exports = { generateMovieObject, generateModifiedMovieObject };
