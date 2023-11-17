const db = require('../models/index')
const ChatGroup = db.chat_group
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//create a group 
exports.createGroup = async (req, res) => {
  try {
    const { group_name, members, user_id } = req.body;
    const group = await ChatGroup.create({ group_name, members, user_id, status: 1 });
    res.status(201).json({
      status: true,
      message: "Group created successfully",
      data: group
    })

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


//get all group list based on user_id and active 

exports.groupList = async (req, res) => {
  try {
    const user_id = req.userId
    ChatGroup.findAll({ where: { status: 1, members: { [Op.substring]: user_id.toString() } } })
      .then((groups) => {
        if (groups) {
          res.status(200).json({
            status: true,
            message: "Group Data",
            data: groups
          })
        } else {
          res.status(204).json({
            status: true,
            message: "No content",
            data: []
          })
        }
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//update a group  
//add member/menbers  in a group

exports.addMembers = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { group_name, members, user_id } = req.body;
    const group = await ChatGroup.findOne({ where: { group_name: group_name, user_id: user_id } });
    if (!group) {
      return res.status(409).send({ message: "group is not exist." });
    }
    console.log("group.members", group, group.members);
    const existingMembers = JSON.parse(group.members);
    const updatedMembers = existingMembers.concat(JSON.parse(members));
    await group.update({ members: JSON.stringify(updatedMembers) });
    res.status(200).json({
      status: true,
      message: "Member Added successfully.",
      data: group
    })

  } catch (error) {
    console.error(error);;
    if (error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
      const errors = error.errors.map((error) => error.message);
      res.status(406).json({ errors });
    } else {
      throw error
    }
  }
}

//inactive  a group based on group id (only group owner can inactive the group )

exports.inactiveGroup = async (req, res) => {
  try {
    const id = req.params.group_id;
    const user_id = req.userId;
    const group = await ChatGroup.findOne({ where: { id: id, user_id: user_id } });
    if (!group) {
      return res.status(406).send({ message: "group is not exist / don't have permission to delete." });
    }

    const inactiveGroup = group.update({ status: 0 })
    res.status(200).json({
      status: true,
      message: group.group_name + " , group deleted successfully.",
      data: inactiveGroup
    });

    /** Broadcast to the user belongs to the group as group deleted  */
    try {
      const io = req.app.get('io');
      const boardcastMsg = await io.to(id.toString()).emit('groupDeleted', {group_name:group.group_name, group_id:group.id});
      console.log("successfully boardcast , group deleted ", boardcastMsg, inactiveGroup)
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
}