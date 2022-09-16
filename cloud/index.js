/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

exports.getHolidays = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const realHolidays = [];
  const fakeHolidays = [];
  let returnObj = {};
  const axios = require("axios");
  let requestString = `${process.env.API_ENDPOINT}/holidays?api_key=${process.env.API_KEY}&country=sg&year=2022`;
  axios
    .get(requestString)
    .then((response) => {
      for (holiday of response.data.response.holidays) {
        if (holiday.type.includes("National holiday")) {
          realHolidays.push(holiday);
        } else {
          fakeHolidays.push(holiday);
        }
      }
      console.log(realHolidays);
      console.log(fakeHolidays);
      returnObj["real-holidays"] = realHolidays;
      returnObj["fake-holidays"] = fakeHolidays;

      return res.status(200).send(returnObj);
    })
    .catch((err) => res.status(500).send(err));
};
