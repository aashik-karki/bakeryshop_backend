const express = require("express");
const router = express.Router();
const roleAuth = require("../common.middleware.js");

const connection = require(`../database/connection.js`);
console.log("i am inside the  items route");

router.post("/", roleAuth(["Admin"]), (req, res, next) => {
  const body = req.body;
  console.log("== this is a body==", req.body);
  const {
    category_id,
    created_AT,
    updated_AT,
    name,
    recepir_url,
    price,
    product_id,
  } = body;
  connection.connect(function (err) {
    console.log("==connected==");

    const sql =
      "INSERT INTO items(category_id ,created_AT,updated_AT,name,recepir_url,price,product_id) VALUES ?";
    values = [
      [
        category_id,
        created_AT,
        updated_AT,
        name,
        recepir_url,
        price,
        product_id,
      ],
    ];

    connection.query(sql, [values], function (err, result) {
      console.log("this is a result", result);
      res.status(201).send("you have successfully added bakery Items");
    });
  });
});

router.get("/:id", roleAuth(["user", "Admin"]), (req, res, next) => {
  const id = req.params.id;
  console.log("this is a id ", id);
  connection.query(
    "SELECT * FROM items WHERE product_id = ?",
    [id],
    function (err, results, fields) {
      const response = results;
      res.status(201).send(response);
    }
  );
  console.log("this is a single item of the bakery");
});

router.get("/", roleAuth(["user", "Admin"]), (req, res, next) => {
  connection.query("SELECT * FROM items", function (err, results, fields) {
    res.status(201).send(results);
  });
});

router.patch("/:id", roleAuth(["Admin"]), (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const { name, recepir_url, price } = body;
  connection.connect(function (err) {
    if (err) throw err;
    console.log("connection established---");
    const sql =
      "UPDATE items SET name=?,recepir_url=? ,price=? WHERE product_id=?";
    const values = [name, recepir_url, price, id];

    connection.query(sql, values, function (err, result) {
      console.log("this is a result", result);

      res.status(201).send("edited successfully");
    });
  });
});

router.delete("/:id", roleAuth(["Admin"]), (req, res, next) => {
  console.log("this is a log in user", req.user);
  if (req.user[0].role !== "Admin") {
    return res.status(400).send("no authorization for user");
  }
  const id = req.params.id;
  connection.execute(
    "DELETE FROM items WHERE product_id=?",
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
});

module.exports = router;
