const express = require("express");
const router = express.Router();
const connection = require(`../database/connection.js`);

router.post("/", (req, res, next) => {
  console.log("this is a req");
  // req.session.destroy();d
  res
    .clearCookie("connect.sid")
    .send("you have successfully delete the sessions ");

  // res.clearCookie("aashik").send("you have successfully logout");
});

module.exports = router;
