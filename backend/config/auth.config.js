const dotenv = require('dotenv');
dotenv.config({path:'./dev.env'});
module.exports = {
    secret: process.env.SECRET_KEY ||  "my-secret-key"
};