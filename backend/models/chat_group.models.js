module.exports = (sequelize, Sequelize) => {
    const ChatGroup = sequelize.define("chat_group", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          name: "group_name",
          msg: 'This group name is already exist try another name.'
        },
        validate: {
          notNull: {
            msg: "Group name is required.",
          }
        },
      },
      members: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Minimum one member is required.",
          },
          // isJSON:{
          //   msg: "Members should be a valid json list.",
          // }
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Group owner is required."
          }
        }
      },
      status:{
        type: Sequelize.INTEGER,
        default:1
      }
    }, {
      freezeTableName: true,
      timestamps:false
  });
    return ChatGroup;
  };