const { verifyCreateUser } = require("../middleware"); //verifyCreateUser
const { authJwt} = require('../middleware');
module.exports = (app)=>{
    const user = require('../controller/user.controller');
    // Create a new user
    app.post("/api/add_user", [
        authJwt.verifyToken,
        authJwt.isAdmin,
        verifyCreateUser.checkDuplicateUsernameOrEmail,
        verifyCreateUser.checkDuplicateMobileNumber
      ],user.createUser);

    // Get all users
    app.get("/api/users", [
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
    ], user.updateUser);

    // Delete a user with Id
    app.delete("/api/user/:user_id", [
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],user.deleteUser); 

}