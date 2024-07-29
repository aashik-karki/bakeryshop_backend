function roleAuth(role) {
  return function (req, res, next) {
    const userRole = req.user[0].role;
    if (!role.includes(userRole)) {
      return res.status(401).send({ message: "unauthorized user" });
    }
    next();
  };
}

module.exports = roleAuth;
