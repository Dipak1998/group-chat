const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
verifySocket = (socket, next) => {
    // Implement your authentication logic here
    console.log("socket.handshake .....................", socket.handshake.token)
    const authToken = socket.handshake.query.token;
    if (!authToken) {
      console.log('Unauthorized connection. No authentication token provided.');
      return next(new Error('Unauthorized connection'));
    }
    jwt.verify(authToken, config.secret, (err, decoded) => {
        if (err) {
          return next(new Error('Unauthorized connection'));
        }
        console.log('Authenticated with token:', authToken);
        next();
    });
    next();
};

  const authSocket = {
    verifySocket: verifySocket,
  };
  module.exports = authSocket;