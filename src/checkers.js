function validTitleChecker(reqBody, res) {
  if (!reqBody.title) {
    res.json({ status: 400, message: "Please provide a title" });
    return false;
  }
  return true;
}

function validRatingChecker(reqBody, res) {
  if (
    reqBody.rating == null ||
    typeof reqBody.rating != "number" ||
    reqBody.rating < 0 ||
    reqBody.rating > 5
  ) {
    res.json({
      status: 400,
      message: "Please provide a rating between 0 and 5",
    });
    return false;
  }
  return true;
}

function validDescriptionChecker(reqBody, res) {
  if (!reqBody.description) {
    res.json({ status: 400, message: "Please provide a description" });
    return false;
  }
  return true;
}

function validActorChecker(reqBody, res) {
  if (!reqBody.actor) {
    res.json({ status: 400, message: "Please provide an actor" });
    return false;
  }
  return true;
}

module.exports = {
  validTitleChecker,
  validRatingChecker,
  validDescriptionChecker,
  validActorChecker,
};
