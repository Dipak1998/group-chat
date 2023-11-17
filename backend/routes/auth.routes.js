const { authJwt} = require('../middleware');

const auth_controller = require("../controller/auth.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signin", auth_controller.signin);
  
  // Change user password 
  app.put("/api/auth/change_password", [
    authJwt.verifyToken
  ],auth_controller.passwordChange);
};