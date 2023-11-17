const db = require("../models");
const ROLE = db.ROLE;
const User = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }
      next();
    });
};
checkDuplicateMobileNumber = (req, res, next) => {
  User.findOne({
    where: {
      mobile_no: req.body.mobile_no || null
    }
  }).then(user => {
    if (user) {
      res.status(406).send({
        message: "Failed! Mobile_no is already in use!"
      });
      return;
    }
    next();
  });
}
const verifyCreateUser = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkDuplicateMobileNumber: checkDuplicateMobileNumber
};
module.exports = verifyCreateUser;