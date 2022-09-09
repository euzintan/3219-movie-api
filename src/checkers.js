function validTitleChecker(reqBody, res) {
  if (!reqBody.title) {
    return res.send("Please provide a title");
  }
}

function validRatingChecker(reqBody, res) {
  if (
    !reqBody.rating ||
    typeof reqBody.rating != "number" ||
    reqBody.rating < 0 ||
    reqBody.rating > 5
  ) {
    res.send("Please provide a valid rating between 0 and 5");
  }
}

function validDescriptionChecker(reqBody, res) {
  if (!reqBody.description) {
    res.send("Please provide a description");
  }
}

module.exports = {
  validTitleChecker,
  validRatingChecker,
  validDescriptionChecker,
};
