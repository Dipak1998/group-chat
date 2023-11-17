
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


    // Add member in group

    app.put("/api/add_members", [
      authJwt.verifyToken
    ],
    chat_group.addMembers);

    // Delete a group 

    app.put("/api/group/:group_id", [
      authJwt.verifyToken,
    ],chat_group.inactiveGroup); 

}
