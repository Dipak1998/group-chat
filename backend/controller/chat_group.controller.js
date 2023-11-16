const db = require('../models/index')
const ChatGroup = db.chat_group
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//create a group 
exports.createGroup = async (req, res) => {
    try {
      const { group_name , members, user_id} = req.body;

      if(!group_name){
        return res.status(406).send({ message: "group name is required." });
      }

      // atleast one member needs with group_admin
      if(!members){
        return res.status(406).send({ message: "minimum one memebr is required." });
      }
      if(!user_id){
        return res.status(406).send({ message: "group owner is required." });
      }

      const groupNameExist = await ChatGroup.findOne({ where: { group_name: group_name } });
      if(groupNameExist){
        return res.status(409).send({ message: "group name is already exist try another name." });
      }

      const group = await ChatGroup.create({ group_name,members,user_id,status:1 });
      res.status(201).json({
        status:true,
        message:"Group created successfully",
        data:group
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }; 




//get all group list based on user_id

exports.groupList = async (req, res) =>{
    try {
        const user_id = req.userId

        if(!user_id){
            return res.status(404).send({ message: "member id is required." });

        }

        ChatGroup.findAll({where:{status:1, members:{[Op.substring]: user_id.toString()} } }).then((groups)=>{
            if(groups){
                res.status(200).json({
                    status:true,
                    message:"Group Data",
                    data:groups
                })
            }else{
                res.status(204).json({
                    status:true,
                    message:"No content",
                    data:[]
                })
            }
        })
    }catch(error){
        console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

//update a group  
//add member/menbers  in a group

//delete a group based on group id (only admin can delete the group )