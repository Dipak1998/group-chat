const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        error:err
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    console.log("user for admin role ", user.role_id);
    let roleId = user.role_id;
    if(roleId == 1){
      next();
      return;
    }else {
      res.status(401).send({
        message: "User is not authurozied"
      });
      return;
    }
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};
module.exports = authJwt;