const express = require("express");
const app = express();

const port = 5000;

const category = require("./routes/category.routes");

const items = require("./routes/items.routes");

const reviews = require("./routes/reviews.routes");

const user = require("./routes/user.routes");

const login = require("./routes/login.routes");

const logout = require("./routes/logout.routes");

const cookieParser = require("cookie-parser");

const sessions = require("express-session");

var jwt = require("jsonwebtoken");

const secreKey = "ggg";

const connection = require("./database/connection");

// const sessionHandler = sessions({
//   secret: "keyboard cat",
//   saveUninitialized: false,
//   resave: false,
//   proxy: true,
//   cookie: {
//     secure: false,
//   },
// });

app.use(express.json());

app.use("/user", user);
app.use("/login", login);

app.use(function (req, res, next) {
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    const bearer = bearerToken.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({ result: "invalid token" });
  }
});

app.use(function (req, res, next) {
  jwt.verify(req.token, secreKey, (err, authData) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // res.json({ messge: "user get successfully", authData });
      const userId = authData.id;
      connection.query(
        "SELECT * FROM user WHERE id=?",
        [userId],
        function (err, result) {
          req.user = result;
          console.log("this is a req of a particular user", req.user);
          next();
        }
      );
    }
  });
});

app.use(cookieParser());

app.use("/category", category);

app.use("/items", items);

app.use("/reviews", reviews);

app.use("/logout", logout);

app.listen(port, () => {
  console.log(`Bakery server is running in the ${port}`);
});
