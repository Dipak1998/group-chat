const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log("bcrypt.hashSync(req.body.password.trim(), 8)",bcrypt.hashSync(req.body.password.trim(), 8))
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign(
        { id: user.id ,
          name:user.name,
          email:user.email, 
          role:user.role,
          mobile_no:user.mobile_no
        }, 
        config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        message:"success",
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//change the password
exports.passwordChange = (req,res)=>{
  console.log("req.body", req.body)
  const new_password = req.body.new_password.trim();
  const old_password = req.body.old_password.trim();
  const email = req.body.email;
  User.findOne({
      where: {
        email: email
      }
    })
    .then(user => {
      const isValidPassword = bcrypt.compareSync(
          old_password,
          user.password
        );
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      if(!isValidPassword){
        return res.status(404).send({ message: "Credentials are not valid." });
      }
      else{
        User.update({password: bcrypt.hashSync(new_password, 8)},{where:{email:email}}).then((updated_user)=>{
            res.status(200).json({
                status: true,
                message: "Password changed successfully",
                data:user
            })
        })
        }
      }).catch((err)=>{
        console.log("error occurred", err)
      })
  
}
