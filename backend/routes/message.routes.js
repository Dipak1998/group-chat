
const { authJwt} = require('../middleware');
module.exports = (app)=>{

    const message = require('../controller/message.controller');

    // Create a new chat group 
    app.post("/api/send_message", [
        authJwt.verifyToken,
      ],message.sendMessage);


    // Get all groups by member id
    app.get("/api/messages", [
      authJwt.verifyToken
    ],
    message.allMessage);

    // add memeber in a group 
    app.put("/api/like_message",[
      authJwt.verifyToken,
    ], message.likeMessage); 

}
