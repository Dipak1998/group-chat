
const { authJwt} = require('../middleware');
module.exports = (app)=>{
    const chat_group = require('../controller/chat_group.controller');
    // Create a new chat group 
    app.post("/api/create_group", [
        authJwt.verifyToken,
      ],chat_group.createGroup);

    // Get all groups by member id
    app.get("/api/groups", [
      authJwt.verifyToken
    ],
    chat_group.groupList);

}
