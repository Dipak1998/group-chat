const db = require('../models/index')
const User = db.user
var bcrypt = require("bcryptjs");


exports.create = (req,res)=>{
    let { name , email, password,mobile_no } = req.body;

    if(!name){
        return res.status(406).send({ message: "name is required." });
    }

    if(!email){
    return res.status(406).send({ message: "email is required." });
    }

    if(!password){
    return res.status(406).send({ message: "password is required." });
    }
    if(!mobile_no){
    return res.status(406).send({ message: "mobile no is required." });
    }

    name = name.trim()
    email = email.trim();
    password =  bcrypt.hashSync(password.trim(), 8);
    mobile_no = req.body.mobile_no.trim();
    const role_id = 2;
    const status = 1;
    const userObj = {
        name:name,
        email:email, 
        password:password ,
        mobile_no:mobile_no, 
        role_id:role_id , 
        status:status
    }
    User.create(userObj).then(()=>{
        res.status(201).json({
            status:true,
            message:"User created successfully",
            data:userObj
        })
    }).catch((err)=>{
        res.json({
            status:false,
            message:err,
            data:userObj
        })
    })

}

// show all users

exports.allUsers = (req,res)=>{
    User.findAll({
        attributes: ['id', 'name', 'email', 'mobile_no', 'role', 'status'],
        where:{status:1}}).then((users)=>{
        if(users){
            res.status(200).json({
                status:true,
                message:"User Data",
                data:users
            })
        }else{
            res.status(204).json({
                status:true,
                message:"No content",
                data:[]
            })
        }
    })
}

// show a user by ID (GET REQUEST)

exports.singleUser = (req,res)=>{
    User.findByPk(req.params.user_id).then((user)=>{
        if(user){
            res.status(200).json({
                status:true,
                message:"Single User Data",
                data:user
            })
        }else{
            res.status(204).json({
                status:true,
                message:"Single User Data",
                data:user
            })
        }
    })
}


// Update a user
exports.update = (req, res) => {
    const id = req.params.user_id;
    const name = req.body.name.trim()
    const email = req.body.email.trim();
    const password = req.body.password
    const role_id = req.body.role_id
    const mobile_no = req.body.mobile_no
    const status = 1
    const userObj = {
        name:name,
        email:email , 
        password:password , 
        mobile_no:mobile_no, 
        role_id:role_id , 
        status:status
    }
    User.update(userObj,{ where: { id: req.params.user_id } }).then(() => {
        res.status(200).json({
            status: true,
            message: "User  updated successfully with id = " + id,
            data:userObj
        });
    });
};

// Delete a user by Id
exports.delete = (req, res) => {
  const id = req.params.user_id;
  User.destroy({
    where: { id: id },
  }).then(() => {
    res.status(200).json({
        status: true,
        message: "User deleted successfully with id = " + id
    });
  });
};