const db = require('../models/index')
const Message = db.message
const ChatGroup = db.chat_group
const User = db.user
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// send a message 
exports.sendMessage = async (req, res) => {
    try {
        const { message, group_id, sender } = req.body;

        if (!message) {
            return res.status(406).send({ message: "message is required." });
        }

        if (!group_id) {
            return res.status(406).send({ message: "group name is required." });
        }

        if (!sender) {
            return res.status(406).send({ message: "sender is required." });
        }

        const groupNameExist = await ChatGroup.findOne({ where: { id: group_id, status:1 } });
        if (!groupNameExist) {
            return res.status(406).send({ message: "group name is not exist." });
        }

        const senderExist = await User.findOne({where: {id:sender, status:1}});
        if (!senderExist) {
            return res.status(406).send({ message: "user is not exist." });

        }

        const newMessage = await Message.create({ message, group_id, sender, status: 1 });

        /** Broadcasting the message to the group */
        try {
            const io = req.app.get('io');
            const boardcastMsg = await io.to(group_id.toString()).emit('messageReceived', newMessage);
            console.log("suucefully boardcast message", boardcastMsg, newMessage)
        } catch (error) {
            console.log("error while boardcasting message", error)
        }

        res.status(201).json({
            status: true,
            message: "Send message successfully",
            data: newMessage
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

//return all message to the user, who belongs to the group

exports.allMessage = async (req, res) => {
    try {
        const user_id = req.userId
        console.log("all message call", user_id);
        const groupList = await ChatGroup.findAll({ where: { status: 1, members: { [Op.substring]: user_id.toString() } } });
        let groupIds = [];
        groupList.forEach((group) => {
            console.log("group", group.id);
            groupIds.push(group.id)
        })
        if (!groupList) {
            res.status(204).json({
                status: true,
                message: "No content",
                data: []
            })
        }

        const messages = await Message.findAll({ where: { group_id: { [Op.in]: [groupIds] },status:1 } })
        res.status(201).json({
            status: true,
            message: "All messages",
            data: messages
        })

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// read a message 


// liked a message  
exports.likeMessage = async (req, res) => {
    try {
        const user_id = req.userId;
        const { message_id } = req.body;
        const message = await Message.findByPk(message_id);
        let cnt = 1;
        if (!message) {
            return res.status(409).send({ message: "message not exist." });
        }
        /** have to check the user already liked or not
         * if already liked then second time have to removed 
         * if not liked then have to increment the like
         */
        let likedUsers = message.like_user_id ? message.like_user_id : [];
        let filterLikedUsers = JSON.parse(likedUsers);
        console.log("likedUsers:", likedUsers, typeof(likedUsers));
        console.log("filterLikedUsers ......", filterLikedUsers, typeof(filterLikedUsers))
        if (likedUsers.includes(user_id)) {
            cnt = -1;
            filterLikedUsers = JSON.parse(likedUsers).filter((item) => item != user_id);
        }else{
            filterLikedUsers.push(user_id)
        }
        message.likes = message.likes ? message.likes + cnt : 1;
        console.log("filterLikedUsers ......", filterLikedUsers)
        message.like_user_id = JSON.stringify(filterLikedUsers);
        await message.save();

        /** Broadcasting the message like details to the group */
        try {
            const io = req.app.get('io');
            const boardcastMsg = await io.to(message.group_id.toString()).emit('messageLiked', message);
            console.log("suucefully boardcast message like", boardcastMsg, message)
        } catch (error) {
            console.log("error while boardcasting message", error)
        }
        res.status(200).json({
            status: true,
            message: "Successfully liked the message",
            data: message
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// delete a message

exports.deleteMessage = async(req,res) => {

}
