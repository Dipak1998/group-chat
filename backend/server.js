const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path:'./config/dev.env'});



app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const db = require("./models");
db.sequelize.sync();
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Drop and Resync with { force: false }");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });






// welcome api
app.get('/api/',(req,res)=>{

  res.status(200).send("Welcome to admin panel")
})

const PORT = process.env.PORT || 4000
const DEVELOPMENT = process.env.NODE_ENV



var server = app.listen(PORT,'localhost',()=>{
  var host = server.address().address;
  var port = server.address().port;
    console.log(`Serve is running in ${DEVELOPMENT} mode on ${PORT} port`);
    console.log("host:", host , ", port:", port)
})

