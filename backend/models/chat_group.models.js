module.exports = (sequelize, Sequelize) => {
    const ChatGroup = sequelize.define("chat_group", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      group_name: {
        type: Sequelize.STRING
      },
      members: {
        type: Sequelize.JSON
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      status:{
        type: Sequelize.INTEGER
      }
    }, {
      freezeTableName: true,
      timestamps:false
  });
    return ChatGroup;
  };