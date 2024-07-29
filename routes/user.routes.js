const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const connection = require(`../database/connection.js`);
console.log("i am inside the user route");

router.get("/", (req, res, next) => {
  connection.query("SELECT * FROM  user", function (err, result, fields) {
    console.log("this is a  result of the user ", result);

    res.status(201).send(result);
  });
});

router.post("/", (req, res, next) => {
  const body = req.body;
  console.log("this is a password", body.password);
  console.log("this is a password", body.role);

  if (body.password !== body.confirmPassword) {
    return res
      .status(500)
      .send("password and conform password doesnt match at all");
  }

  const {
    name,
    userName,
    email,
    id,
    password,
    country,
    created_AT,
    updated_AT,
    role,
  } = body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  connection.connect(function (err) {
    if (err) {
      throw new Error(err.message);
    }

    const dtoData = [
      id,
      name,
      userName,
      email,
      hashedPassword,
      country,
      created_AT,
      updated_AT,
      role,
    ];

    const sql =
      "INSERT INTO user(id,name,userName,email,password,country,created_AT,updated_AT,role) VALUES ?";
    values = [dtoData];

    connection.query(sql, [values], function (err, result) {
      console.log("this is a result", result);
      if (err) {
        return res.status(500).send(err.message);
      }
      // const token = jwt.sign()
      res.status(200).send("User account created succesfully.");
    });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM user WHERE id =?",
    [id],
    function (err, result, fields) {
      res.status(200).send(result);
    }
  );
  console.log("you have access of single  user");
});

router.patch("/:id", (req, res, next) => {
  console.log("you have edited user data base");
  res.status(201).send("successfully edited");
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.execute(
    "DELETE FROM user WHERE id =?",
    [id],
    function (err, result, fields) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("delete succesfullly");
      }
    }
  );
});

module.exports = router;
