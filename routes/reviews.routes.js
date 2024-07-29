const express = require("express");
const router = express.Router();

const connection = require(`../database/connection.js`);
console.log("i am inside the reviews route");

router.get("/", (req, res, next) => {
  connection.query("SELECT * FROM review", function (err, results, fields) {
    res.status(201).send(results);
  });
  console.log("you have get all reviews of the bakery items");
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM review WHERE id =?",
    [id],
    function (err, result, fields) {
      res.status(200).send(result);
    }
  );
  console.log("you have get single reviews of the bakery items");
});

router.post("/", (req, res, next) => {
  const body = req.body;
  const { remarks, star_count, id, product_id } = body;
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connnected");

    const dtoData = [remarks, id, star_count, product_id];
    const sql = "INSERT INTO review(remarks,id,star_count,product_id) VALUES ?";
    values = [dtoData];

    connection.query(sql, [values], function (err, result) {
      console.log("this is a result", result);
      res.status(200).send("you have successfully add a review");
    });
  });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const { start_count, remarks } = body;
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connnected");

    const sql = "UPDATE review SET start_count=? ,remarks=? WHERE id=?";

    const values = [start_count, remarks, id];

    connection.query(sql, values, function (err, result) {
      if (err) {
        return res.status(500).send(err.message);
      }

      console.log("this is a result", result);
      res.status(200).send("you have successfully edit a category");
    });
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  connection.execute(
    "DELETE FROM review WHERE id=?",
    [id],
    function (err, result, fields) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("delete succesfullly");
      }
      console.log("this is a errror ", err);
    }
  );
});
module.exports = router;
