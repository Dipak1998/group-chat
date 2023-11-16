const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path:'./config/dev.env'});

const socketIo = require('socket.io');
const socket = require('./socket/socket');


app.use(cors({
  origin: '*'
}));

// Set up middleware to make io accessible in routes
app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});
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

// apis 
// include application routes
require("./routes/user.routes")(app);
require('./routes/auth.routes')(app);
require('./routes/chat-group.routes')(app);
require('./routes/message.routes')(app);






// welcome api
app.get('/api/',(req,res)=>{

  res.status(200).send("Welcome to admin panel")
})
app.use(express.static(path.join(__dirname, "template")));
app.get('/',function(req,res) {
  console.log("path.join(__dirname+'/'+template+'/index.html')",path.join(__dirname+'/'+'template'+'/index.html'))
  res.sendFile(path.join('/index.html'));
})

const PORT = process.env.PORT || 4000
const DEVELOPMENT = process.env.NODE_ENV



var server = app.listen(PORT,'localhost',()=>{
  var host = server.address().address;
  var port = server.address().port;
    console.log(`Serve is running in ${DEVELOPMENT} mode on ${PORT} port`);
    console.log("host:", host , ", port:", port)
})
const io = socketIo(server);
app.io = io;
socket(io)

