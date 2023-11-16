const { verifySignUp } = require("../middleware");
const { authJwt} = require('../middleware');
module.exports = (app)=>{
    const user = require('../controller/user.controller');
    // Create a new user
    app.post("/api/add-user", [
        authJwt.verifyToken,
        authJwt.isAdmin,
        verifySignUp.checkDuplicateUsernameOrEmail
      ],user.create);

    // Get all users
    app.get("/api/user", [
      authJwt.verifyToken,
      // authJwt.isAdmin,
    ],
    user.allUsers);

    // Get single user by id
    app.get("/api/user/:user_id",[
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],user.singleUser);

    // Update a user with Id
    app.put("/api/user/:user_id",[
      authJwt.verifyToken,
      authJwt.isAdmin,
    ], user.update);

    // Delete a user with Id
    app.delete("/api/user/:user_id", [
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],user.delete); 

}