const db = require('../models/index')
const User = db.user
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var bcrypt = require("bcryptjs");


exports.createUser = (req, res) => {
    let { name, email, password, mobile_no } = req.body;

    name = name ? name.trim() : null
    email = email ? email.trim() : null;
    password = bcrypt.hashSync(password.trim(), 8);
    mobile_no = mobile_no ? mobile_no.trim() : null;
    const role_id = 2;
    const status = 1;
    const userObj = {
        name: name,
        email: email,
        password: password,
        mobile_no: mobile_no,
        role_id: role_id,
        status: status
    }
    User.create(userObj).then(() => {
        res.status(201).json({
            status: true,
            message: "User created successfully",
            data: userObj
        })
    }).catch((error) => {
        console.error(error);;
        if (error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
            const errors = error.errors.map((error) => error.message);
            res.status(406).json({ errors });
        } else {
            throw error
        }
    })

}

// show all users

exports.allUsers = (req, res) => {
    let query = { status: 1 };
    let { user_list, name, email, mobile_no } = req.query || '';

    if (user_list) {
        user_list = JSON.parse(user_list)
        query.id = { [Op.in]: user_list }
    }

    if (name) {
        query.name = { [Op.like]: `%${name}%` }
    }

    if (email) {
        query.email = { [Op.like]: `%${email}%` }
    }

    if (mobile_no) {
        query.mobile_no = { [Op.like]: `%${mobile_no}%` }
    }


    User.findAll({
        attributes: ['id', 'name', 'email', 'mobile_no', 'role_id', 'status'],
        where: query
    }).then((users) => {
        if (users) {
            res.status(200).json({
                status: true,
                message: "User Data",
                data: users
            })
        } else {
            res.status(204).json({
                status: true,
                message: "No content",
                data: []
            })
        }
    })
}

// show a user by ID (GET REQUEST)

exports.singleUser = (req, res) => {
    User.findByPk(req.params.user_id).then((user) => {
        if (user) {
            res.status(200).json({
                status: true,
                message: "Single User Data",
                data: user
            })
        } else {
            res.status(204).json({
                status: true,
                message: "Single User Data",
                data: user
            })
        }
    })
}


// Update a user
exports.updateUser = (req, res) => {
    const id = req.params.user_id;
    const name = req.body.name.trim()
    const email = req.body.email.trim();
    const password = req.body.password
    const role_id = req.body.role_id
    const mobile_no = req.body.mobile_no
    const status = 1
    const userObj = {
        name: name,
        email: email,
        password: password,
        mobile_no: mobile_no,
        role_id: role_id,
        status: status
    }
    User.update(userObj, { where: { id: req.params.user_id } }).then(() => {
        res.status(200).json({
            status: true,
            message: userObj.name+ ",updated successfully.",
            data: userObj
        });
    });
};

// Delete a user by Id
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.user_id;

        const inactiveUser = await User.findOne({where:{id:id, status:1}});
        inactiveUser.update({ status: 0 })
        res.status(200).json({
            status: true,
            message: inactiveUser.name + " ,deleted successfully.",
            data: inactiveUser
        });

        /** Broadcast to the user belongs to the group as group deleted  */
        try {
            const io = req.app.get('io');
            const boardcastMsg = await io.to(id.toString()).emit('userDeleted', inactiveUser);
            console.log("successfully boardcast , group deleted ", boardcastMsg, inactiveUser)
        } catch (error) {
            console.log("error while boardcasting message", error)
        }

    } catch (error) {

        console.error(error);;
        if (error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
            const errors = error.errors.map((error) => error.message);
            res.status(400).json({ errors });
        } else {
            throw error
        }
    }
};