function validTitleChecker(reqBody, res) {
  if (!reqBody.title) {
    return res.json({ status: 400, message: "Please provide a title" });
  }
}

function validRatingChecker(reqBody, res) {
  if (
    !reqBody.rating ||
    typeof reqBody.rating != "number" ||
    reqBody.rating < 0 ||
    reqBody.rating > 5
  ) {
    return res.json({
      status: 400,
      message: "Please provide a rating between 0 and 5",
    });
  }
}

function validDescriptionChecker(reqBody, res) {
  if (!reqBody.description) {
    return res.json({ status: 400, message: "Please provide a description" });
  }
}

function validActorChecker(reqBody, res) {
  if (!reqBody.actor) {
    return res.json({ status: 400, message: "Please provide an actor" });
  }
}

module.exports = {
  validTitleChecker,
  validRatingChecker,
  validDescriptionChecker,
  validActorChecker,
};
