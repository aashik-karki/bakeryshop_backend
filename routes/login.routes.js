const express = require("express");
const router = express.Router();
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
const secreKey = "ggg";

const connection = require(`../database/connection.js`);
console.log("i am inside the login route");

router.post("/", (req, res, next) => {
  console.log("i am inside post function of login route");

  const body = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(body.password)
    .digest("hex");

  connection.query(
    "SELECT * FROM user WHERE email=?",
    [body.email],
    function (err, result) {
      console.log("this is a result", result);

      if (result.length === 0) {
        return res.status(500).send("invalid email and password.");
      }

      if (result[0]?.password !== hashedPassword) {
        return res.status(500).send("invalid email and password.");
      }
      const token = {
        id: result[0]?.id,
      };

      const accessToken = jwt.sign(token, secreKey, { expiresIn: "300000" });
      console.log("this is a token generate in the login route", accessToken);
      const response = {
        accessToken: accessToken,
        message: "you have successfully login",
      };

      // const session = req.session;
      // session.userId = result[0].id;
      // console.log("this is a session", session);
      // return res
      //   .writeHead(200, { "Set-Cooki": "toke=encrptedString" })

      //   .send();
      // res.cookie("aashik", "okay", {
      //   httpOnly: true,
      //   secure: true,
      // });
      // res.clearCookie("aashik");
      // console.log("this is a cookies that have send ", req.cookies);
      return res.send(response);
    }
  );
});

module.exports = router;
