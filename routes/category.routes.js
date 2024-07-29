const express = require("express");
const router = express.Router();
const connection = require(`../database/connection.js`);
console.log("i am inside the category route");

router.get("/", (req, res, next) => {
  console.log("i am inside get all function of category route");

  console.log("this is a user", req?.user);
  console.log("this is a token ", req.token);
  connection.query("SELECT * FROM category", function (err, results, fields) {
    console.log(results);
    const response = results;
    console.log(fields);
    res.status(200).send(response);
  });
  console.log("you have get all categories of the bakery");
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.execute(
    "SELECT * FROM category WHERE category_id=?",
    [id],
    function (err, results, fields) {
      console.log(results);
      const response = results;
      res.status(201).send(response);
    }
  );
  console.log("now you have get single category");
});

router.post("/", (req, res, next) => {
  const body = req.body;
  const { name, category_id } = body;
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connnected");

    const sql = "INSERT INTO category(name,category_id) VALUES ?";
    values = [[name, category_id]];

    connection.query(sql, [values], function (err, result) {
      console.log("this is a result", result);
      res.status(200).send("you have successfully add a category");
    });
  });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const { name } = body;
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connnected");

    const sql = "UPDATE category SET name=? WHERE category_id=?";
    const values = [name, id];

    connection.query(sql, values, function (err, result) {
      console.log("this is a result", result);
      res.status(200).send("you have successfully edit a category");
    });
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.execute(
    "DELETE FROM category WHERE category_id=?",
    [id],
    function (err, result, fields) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("delete succesfullly");
      }
      console.log("this is a rrror ", err);
    }
  );
  console.log("you are sure you want to delete category?");
});

module.exports = router;
